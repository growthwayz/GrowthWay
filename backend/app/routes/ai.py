"""Only implemented AI features are exposed; no demonstration responses."""
import hashlib
from fastapi import APIRouter, HTTPException, Request, Response
from app.core.config import get_settings
from app.core.security import rate_limit
from app.models.ai import ChatRequest, ChatResponse

router = APIRouter(prefix='/api/ai', tags=['ai'])

@router.post('/chat', response_model=ChatResponse)
async def chat_with_ai(data: ChatRequest, request: Request, response: Response):
    response.headers['Cache-Control'] = 'no-store'
    settings = get_settings()
    service = getattr(request.app.state, 'ai_service', None)
    if not settings.AI_ENABLED or service is None:
        raise HTTPException(503, 'Chat is unavailable. Please use the contact page.')
    await rate_limit(request, 'ai-chat', settings.AI_IP_LIMIT, 60)
    session = hashlib.sha256(data.sessionId.encode()).hexdigest()
    # Session limits supplement IP limits; rotating client IDs cannot bypass the latter.
    await rate_limit(request, 'ai-session:' + session, settings.AI_SESSION_LIMIT, 3600)
    return await service.ask_ai(data)
