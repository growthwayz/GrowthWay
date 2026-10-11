"""
Lead generation routes (Phase B).
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks, Request
from datetime import datetime, timedelta
from app.db.mongodb import get_db
from app.models.schemas import LeadCreate, ErrorResponse
from app.services.email import send_lead_notification

router = APIRouter(prefix="/api/leads", tags=["leads"])

# Simple in-memory rate limiting (IP-based) for leads
# Real apps should use redis, but this is fine for this requirement (e.g. 5/hour/IP)
RATE_LIMIT_REQUESTS = 5
RATE_LIMIT_HOURS = 1
_rate_limits = {}

def check_rate_limit(ip: str):
    now = datetime.utcnow()
    # Cleanup old entries
    if ip in _rate_limits:
        _rate_limits[ip] = [t for t in _rate_limits[ip] if now - t < timedelta(hours=RATE_LIMIT_HOURS)]
        if len(_rate_limits[ip]) >= RATE_LIMIT_REQUESTS:
            return False
        _rate_limits[ip].append(now)
    else:
        _rate_limits[ip] = [now]
    return True

@router.post("", response_model=dict, responses={429: {"model": ErrorResponse}, 400: {"model": ErrorResponse}})
async def create_lead(lead: LeadCreate, request: Request, background_tasks: BackgroundTasks):
    """
    Submit a new lead/enquiry.
    Validates payload, checks rate limits, saves to DB, sends email notification.
    """
    client_ip = request.client.host if request.client else "unknown"
    if not check_rate_limit(client_ip):
        raise HTTPException(
            status_code=429, 
            detail={"code": "RATE_LIMIT_EXCEEDED", "message": "Too many requests. Try again later.", "details": []}
        )
    
    if not lead.consent:
        raise HTTPException(
            status_code=400,
            detail={"code": "VALIDATION_ERROR", "message": "Consent is required.", "details": ["consent"]}
        )

    # Basic honeypot / timestamp check could be implemented on the frontend and validated here
    
    db = get_db()
    
    # Save to db
    lead_doc = lead.model_dump()
    lead_doc["status"] = "New"
    lead_doc["createdAt"] = datetime.utcnow()
    lead_doc["source"] = "organic" # Can be updated if we pass UTMs
    
    result = await db.leads.insert_one(lead_doc)
    
    # Send email in background
    background_tasks.add_task(send_lead_notification, lead_doc)
    
    return {"id": str(result.inserted_id), "status": "New"}
