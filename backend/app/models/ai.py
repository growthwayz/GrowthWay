from pydantic import BaseModel
from typing import Optional, List

class ChatMessage(BaseModel):
    role: str # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    sessionId: str
    message: str
    history: List[ChatMessage] = []

class ChatResponse(BaseModel):
    reply: str
    suggestions: List[str] = []
    cta: Optional[str] = None

class RecommendRequest(BaseModel):
    goal: str
    businessType: str

class ServiceRecommendation(BaseModel):
    slug: str
    reason: str

class RecommendResponse(BaseModel):
    services: List[ServiceRecommendation]

class BriefRequest(BaseModel):
    requirement: str

class BriefResponse(BaseModel):
    businessType: str
    goal: str
    services: List[str]
    budgetRange: Optional[str] = None
    timeline: Optional[str] = None
    summary: str

class SearchRequest(BaseModel):
    query: str

class SearchResponse(BaseModel):
    projects: List[dict] # Would be List[ProjectOut] ideally
    suggestedIndustries: List[str] = []
