"""Opt-in live Groq probe; uses public fixture services, never connects to MongoDB."""
import asyncio
import json
import sys
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from langsmith import tracing_context
from app.core.config import get_settings
from app.db.mongodb import InMemoryDatabase
from app.db.seeds import SERVICE_DATA
from app.models.ai import ChatRequest
from app.services.ai import AIService

class Probe:
    def __init__(self, chain, stage): self.chain, self.stage = chain, stage
    async def ainvoke(self, payload):
        try:
            result = await self.chain.ainvoke(payload)
            print(json.dumps({'stage': self.stage, 'result': 'ok'}), flush=True)
            return result
        except Exception as exc:
            body = getattr(exc, 'body', None)
            error = body.get('error', body) if isinstance(body, dict) else {}
            code = error.get('code')
            # Allowlisted diagnostic values only: no raw model output or provider messages.
            print(json.dumps({'stage': self.stage, 'error': type(exc).__name__,
                'status': getattr(exc, 'status_code', None),
                'code': code if code in {'json_validate_failed', 'rate_limit_exceeded', 'invalid_api_key'} else None}), flush=True)
            raise

async def main():
    service = AIService(get_settings())
    service.answer_chain = Probe(service.answer_chain, 'generation')
    service.review_chain = Probe(service.review_chain, 'review')
    database = InMemoryDatabase()
    for slug, title, *_ in SERVICE_DATA:
        await database.services.insert_one({'slug':slug, 'title':title, 'published':True})
    try:
        with patch('app.services.ai.get_db', return_value=database), tracing_context(enabled=False):
            for question in ['can growthway help my clothing line?', 'these answers seem a little vague']:
                data = ChatRequest(sessionId='live-probe-test', message=question,
                    history=[{'role':'user','content':'can growthway help my clothing line?'}] if 'vague' in question else [])
                try:
                    result = await service.ask_ai(data)
                    print(json.dumps({'question':question, 'reply':result.reply}), flush=True)
                except Exception as exc:
                    print(json.dumps({'question':question, 'error':type(exc).__name__, 'status':getattr(exc,'status_code',None)}), flush=True)
    finally:
        await service.close()

if __name__ == '__main__': asyncio.run(main())
