from fastapi import APIRouter, Request, HTTPException, BackgroundTasks
from app.models.schemas import LeadCreate
from app.db.mongodb import get_db
from app.core.security import rate_limit
from app.auth.jwt import now
from app.services.email import notify_lead

router = APIRouter(prefix='/api', tags=['leads'])
@router.post('/leads', status_code=201)
async def create_lead(data: LeadCreate, request: Request, tasks: BackgroundTasks):
    await rate_limit(request, 'leads', 5, 3600)
    if data.website_fax_hp: raise HTTPException(400, 'Unable to submit this enquiry')
    if not data.consent: raise HTTPException(422, 'Please consent to being contacted about this enquiry')
    for slug in set(data.servicesNeeded):
        if not await get_db().services.find_one({'slug': slug, 'published': True}): raise HTTPException(422, 'Choose a currently available service')
    lead = data.model_dump(exclude={'website_fax_hp'})
    lead.update(status='New', createdAt=now(), updatedAt=now(), revision=1, notificationStatus='pending', notificationAttempts=0)
    result = await get_db().leads.insert_one(lead)
    # Persist before notification. SMTP failures never discard an enquiry.
    tasks.add_task(notify_lead, result.inserted_id)
    return {'id': str(result.inserted_id), 'message': 'Your enquiry has been received.'}
