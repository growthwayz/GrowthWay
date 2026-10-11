"""
AI feature routes (Phase D).
"""

from fastapi import APIRouter, HTTPException, Request
from app.models.ai import (
    ChatRequest, ChatResponse, 
    RecommendRequest, RecommendResponse,
    BriefRequest, BriefResponse,
    SearchRequest, SearchResponse
)
# Placeholder for actual AI service implementation
# from app.services.ai import ask_ai, recommend_services, generate_brief, search_portfolio

router = APIRouter(prefix="/api/ai", tags=["ai"])

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest, req: Request):
    """Chat with the AI assistant."""
    # Dummy response for now, in a real implementation this calls services/ai.py
    return ChatResponse(
        reply="Hello! I'm the Growthway AI assistant. How can I help you grow your brand today?",
        suggestions=["What services do you offer?", "Tell me about your branding process."],
        cta="/contact"
    )

@router.post("/recommend", response_model=RecommendResponse)
async def recommend(request: RecommendRequest):
    """Recommend services based on goals and business type."""
    return RecommendResponse(
        services=[
            {"slug": "branding", "reason": "A strong brand identity is foundational for your goal."},
            {"slug": "web-design", "reason": "A modern web presence helps convert your target audience."}
        ]
    )

@router.post("/brief", response_model=BriefResponse)
async def create_brief(request: BriefRequest):
    """Generate a structured brief from a natural language requirement."""
    return BriefResponse(
        businessType="Startup",
        goal=request.requirement[:50] + "...",
        services=["branding", "web-design"],
        budgetRange="5k-10k",
        timeline="1-2-months",
        summary="A comprehensive project covering branding and digital presence."
    )

@router.post("/search", response_model=SearchResponse)
async def search(request: SearchRequest):
    """Search portfolio projects using natural language."""
    return SearchResponse(
        projects=[], # Dummy empty list
        suggestedIndustries=["startups", "hospitality"]
    )
