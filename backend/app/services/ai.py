"""Groq-backed RAG service. No tools, private records, or agent actions."""
import asyncio
import json
import logging
import httpx
from fastapi import HTTPException
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.exceptions import OutputParserException
from groq import BadRequestError, RateLimitError, APIConnectionError, InternalServerError
from langsmith import tracing_context
from app.core.config import BACKEND_DIR
from app.db.mongodb import get_db
from app.models.ai import ChatResponse, GeneratedAnswer, AnswerReview
from app.services.ai_knowledge import KnowledgeBase
from app.services.ai_guardrails import (
    fallback, obvious_injection, answer_rejection_reason, conversational_reply,
    is_follow_up, SUGGESTIONS,
)
from app.services.ai_prompts import ANSWER_PROMPT, REVIEW_PROMPT

logger = logging.getLogger('growthway.ai')

def provider_code(exc):
    body = getattr(exc, 'body', None)
    error = body.get('error', body) if isinstance(body, dict) else {}
    code = error.get('code') if isinstance(error, dict) else None
    return code if code in {'json_validate_failed', 'rate_limit_exceeded', 'invalid_api_key'} else 'other'

def structured_model(model, schema, strict):
    if not strict:
        return model.with_structured_output(schema, method='json_schema')
    # This installed ChatGroq version ignores strict=True in with_structured_output.
    # Bind the native Groq format explicitly, then retain Pydantic validation.
    definition = schema.model_json_schema()
    definition['required'] = list(definition['properties'])
    for field in definition['properties'].values():
        field.pop('default', None)
    return model.bind(response_format={'type': 'json_schema', 'json_schema': {
        'name': schema.__name__, 'strict': True, 'schema': definition,
    }}) | PydanticOutputParser(pydantic_object=schema)

class AIService:
    def __init__(self, settings):
        if settings.AI_PROVIDER != 'groq' or not settings.AI_API_KEY or not settings.AI_MODEL:
            raise ValueError('AI requires Groq provider, API key, and model configuration')
        self.settings = settings
        self.knowledge = KnowledgeBase(BACKEND_DIR / settings.AI_KNOWLEDGE_PATH, settings.AI_TOP_K)
        self.http = httpx.Client(timeout=settings.AI_TIMEOUT_SECONDS)
        self.async_http = httpx.AsyncClient(timeout=settings.AI_TIMEOUT_SECONDS)
        strict = settings.AI_MODEL in {'openai/gpt-oss-20b', 'openai/gpt-oss-120b'}
        model = ChatGroq(api_key=settings.AI_API_KEY, model=settings.AI_MODEL,
                         temperature=0, max_tokens=settings.AI_MAX_TOKENS,
                         timeout=settings.AI_TIMEOUT_SECONDS, max_retries=0,
                         http_client=self.http, http_async_client=self.async_http,
                         **({'reasoning_effort': 'low'} if strict else {}))
        self.answer_chain = ChatPromptTemplate.from_messages([
            ('system', ANSWER_PROMPT), ('human', '{data}')
        ]) | structured_model(model, GeneratedAnswer, strict)
        self.review_chain = ChatPromptTemplate.from_messages([
            ('system', REVIEW_PROMPT), ('human', '{data}')
        ]) | structured_model(model, AnswerReview, strict)
        self.slots = asyncio.Semaphore(settings.AI_MAX_CONCURRENT)

    async def close(self):
        await self.async_http.aclose()
        self.http.close()

    async def ask_ai(self, data):
        if obvious_injection(data.message):
            logger.info('Chat fallback: injection')
            return fallback()
        conversation = conversational_reply(data.message)
        if conversation is not None:
            return conversation
        if self.slots.locked():
            raise HTTPException(429, 'Chat is busy. Please try again shortly.', headers={'Retry-After': '5'})
        async with self.slots:
            try:
                # One deadline covers retrieval, database, generation AND review.
                with tracing_context(enabled=False):
                    async with asyncio.timeout(self.settings.AI_TIMEOUT_SECONDS):
                        return await self._answer(data)
            except RateLimitError:
                logger.warning('Chat request failed: provider_rate_limit')
                raise HTTPException(429, 'The AI provider is busy. Please wait a minute and retry.', headers={'Retry-After':'60'}) from None
            except TimeoutError:
                logger.warning('Chat request failed: deadline')
                raise HTTPException(504, 'The answer took too long. Please retry your message.') from None
            except Exception as exc:
                logger.warning('Chat request failed (%s, code=%s)', type(exc).__name__, provider_code(exc))
                raise HTTPException(503, 'Chat is unavailable. Please use the contact page.') from None

    async def _invoke(self, chain, payload, stage):
        for attempt in range(2):
            try:
                return await chain.ainvoke(payload)
            except (OutputParserException, APIConnectionError, InternalServerError, BadRequestError) as exc:
                recoverable = not isinstance(exc, BadRequestError) or provider_code(exc) == 'json_validate_failed'
                logger.warning('Chat model failure: stage=%s type=%s code=%s retry=%s',
                               stage, type(exc).__name__, provider_code(exc), recoverable and attempt == 0)
                if not recoverable or attempt:
                    raise
                await asyncio.sleep(.25)

    async def _answer(self, data):
        # Browser assistant messages may be forged; never use them as evidence.
        history = [m.content for m in data.history
                   if m.role == 'user' and conversational_reply(m.content) is None][-2:]
        query = data.message
        if not is_follow_up(query):
            history = []
        elif not history:
            logger.info('Chat fallback: clarification')
            return fallback('clarification')
        if history:
            query += ' ' + history[-1][:500]
        documents = await asyncio.to_thread(self.knowledge.retrieve, query)
        if not documents:
            logger.info('Chat fallback: no_retrieval_matches')
            return fallback()
        services = await get_db().services.find(
            {'published': True, 'isPlaceholder': {'$ne': True}},
            {'_id': 0, 'slug': 1, 'title': 1},
        ).limit(100).to_list(100)
        payload = {'question': data.message, 'previous_user_messages': history,
                   'knowledge': [{'id': d.metadata['record_id'], 'text': d.page_content,
                                  'version': d.metadata['version']} for d in documents],
                   'available_services': services}
        for attempt in range(2):
            answer = await self._invoke(self.answer_chain, {'data': json.dumps(payload, ensure_ascii=False)}, 'generation')
            if answer.outcome != 'answer':
                logger.info('Chat fallback: %s', answer.outcome)
                return fallback(answer.outcome)
            if not answer.answerable:
                logger.info('Chat fallback: missing_information')
                return fallback()
            rejection = answer_rejection_reason(answer, documents, [s['slug'] for s in services])
            if rejection:
                logger.info('Chat answer rejected: %s', rejection)
            else:
                review = await self._invoke(self.review_chain, {'data': json.dumps(
                    {**payload, 'proposed_answer': answer.model_dump()}, ensure_ascii=False)}, 'review')
                if review.safe and review.supported and review.in_scope:
                    return ChatResponse(reply=answer.reply, suggestions=SUGGESTIONS, cta='/contact',
                                        sources=list(dict.fromkeys(answer.evidence_ids))[:8])
                logger.info('Chat review rejected: safe=%s supported=%s in_scope=%s',
                            review.safe, review.supported, review.in_scope)
                if not review.in_scope:
                    return fallback('out_of_scope')
                rejection = 'review'
            if attempt == 0:
                # Retry once inside the same request deadline. Do not forward rejected
                # prose or bypass either validation stage on the replacement answer.
                payload['correction_reason'] = rejection
        return fallback('validation')
