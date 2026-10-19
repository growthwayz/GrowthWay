"""Deterministic boundaries supplement (not replace) the evidence review."""
import re
from app.models.ai import ChatResponse

FALLBACK = "I don't have confirmed information to answer that. Could you make your question more specific?"
SUGGESTIONS = ['What services does Growthway offer?', 'How does a project work?', 'How do I start a project?']

def fallback(reason='missing_information'):
    replies = {
        'missing_information': FALLBACK,
        'out_of_scope': "I can help with Growthway's services, process, and project enquiries. What would you like to know about Growthway?",
        'clarification': 'Which Growthway service or project are you asking about?',
        'validation': "I couldn't verify an answer from the available company information. Could you make your question more specific?",
    }
    return ChatResponse(reply=replies[reason], suggestions=SUGGESTIONS, cta=None)


def conversational_reply(text):
    # Full matches only: a greeting followed by a question must still be answered.
    normalized = re.sub(r'[^\w\s]', '', text.lower()).strip()
    normalized = ' '.join(normalized.split())
    if re.fullmatch(r'(hi|hello|hey)( there| growthway)?|good (morning|afternoon|evening)', normalized):
        reply = "Hi! What would you like to know about Growthway's services or starting a project?"
    elif normalized in {'thanks', 'thank you', 'thanks a lot', 'thank you so much'}:
        reply = "You're welcome! Is there anything else you'd like to know about Growthway?"
    elif normalized in {'how are you', 'how are you doing'}:
        reply = "I'm here to help! What would you like to know about Growthway?"
    else:
        return None
    return ChatResponse(reply=reply, suggestions=SUGGESTIONS, cta=None)


def is_follow_up(text):
    # Short does not mean dependent: 'Where are you based?' is a new question.
    # A named subject makes the question usable without earlier conversation.
    # Keep generic references like 'that service' dependent on previous user text.
    if re.search(r'\b(growthway|website|websites|branding|logo|logos|social media|'
                 r'instagram|facebook|meta ads|reels?|photography|product shoots?|'
                 r'personal brand|founders?|lucknow)\b', text, re.I):
        return False
    return bool(re.search(
        r'\b(it|its|that|those|them|these)\b|\b(this|the same) (service|project|process)\b|'
        r'^\s*(tell me more|can you elaborate|please elaborate|go on)[.!?\s]*$',
        text, re.I,
    ))

def obvious_injection(text):
    return bool(re.search(r'(?i)(ignore|override|disregard).{0,45}(instructions|rules|prompt)|'
                          r'(reveal|print|show).{0,30}(system prompt|api key|secret key)|'
                          r'<\|(?:system|im_start)\|>', text))

def validate_answer(answer, documents, available_slugs):
    return answer_rejection_reason(answer, documents, available_slugs) is None


def answer_rejection_reason(answer, documents, available_slugs):
    evidence = {d.metadata['record_id'] for d in documents}
    if not answer.answerable or not answer.evidence_ids or not set(answer.evidence_ids) <= evidence:
        return 'evidence'
    if not set(answer.service_slugs) <= set(available_slugs):
        return 'service_slug'
    text = answer.reply.strip()
    if not text or len(text) > 1500:
        return 'reply_length'
    # Contact links come from application code, never generated prose.
    if re.search(r'https?://|www\.|[\w.+-]+@[\w.-]+\.[a-z]{2,}|<[^>]+>|```|\+?\d[\d ()-]{8,}\d', text, re.I):
        return 'contact_or_markup'
    return 'injection' if obvious_injection(text) else None
