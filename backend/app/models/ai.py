"""Public chat contract and private structured generation contracts."""
from typing import Annotated, Literal
from pydantic import BaseModel, ConfigDict, Field, model_validator

class StrictModel(BaseModel):
    model_config = ConfigDict(extra='forbid', str_strip_whitespace=True)

class ChatMessage(StrictModel):
    role: Literal['user', 'assistant']
    content: Annotated[str, Field(min_length=1, max_length=2000)]

class ChatRequest(StrictModel):
    sessionId: Annotated[str, Field(pattern=r'^[a-zA-Z0-9_-]{8,64}$')]
    message: Annotated[str, Field(min_length=1, max_length=2000)]
    history: list[ChatMessage] = Field(default_factory=list, max_length=6)

    @model_validator(mode='after')
    def context_budget(self):
        if sum(len(m.content) for m in self.history) + len(self.message) > 8000:
            raise ValueError('Conversation context is too long')
        return self

class ChatResponse(StrictModel):
    reply: Annotated[str, Field(min_length=1, max_length=2000)]
    suggestions: list[Annotated[str, Field(min_length=1, max_length=120)]] = Field(default_factory=list, max_length=3)
    cta: Literal['/contact', '/work', '/#services'] | None = None
    sources: list[str] = Field(default_factory=list, max_length=8)

class GeneratedAnswer(StrictModel):
    outcome: Literal['answer', 'missing_information', 'out_of_scope', 'clarification'] = 'answer'
    reply: str
    evidence_ids: list[str]
    service_slugs: list[str]
    answerable: bool

class AnswerReview(StrictModel):
    supported: bool
    safe: bool
    in_scope: bool
