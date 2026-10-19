import smtplib
from email.message import EmailMessage
from starlette.concurrency import run_in_threadpool
from app.core.config import get_settings
from app.db.mongodb import get_db
from app.auth.jwt import now

def send_lead_notification(lead):
    settings = get_settings()
    if not all((settings.SMTP_HOST, settings.EMAIL_FROM, settings.NOTIFICATION_EMAIL)):
        return 'unconfigured'
    message = EmailMessage()
    message['Subject'] = 'New Growthway project enquiry'
    message['From'] = settings.EMAIL_FROM
    message['To'] = settings.NOTIFICATION_EMAIL
    message['Reply-To'] = lead['email']
    message.set_content('\n'.join([f"Name: {lead['name']}", f"Brand: {lead['brand']}", f"Email: {lead['email']}", f"Phone: {lead.get('phone') or 'Not provided'}", f"Services: {', '.join(lead['servicesNeeded'])}", f"Budget: {lead.get('budgetRange') or 'Not provided'}", f"Timeline: {lead.get('timeline') or 'Not provided'}", '', lead['projectDescription']]))
    try:
        factory = smtplib.SMTP_SSL if settings.SMTP_SSL else smtplib.SMTP
        with factory(settings.SMTP_HOST, settings.SMTP_PORT, timeout=15) as smtp:
            if not settings.SMTP_SSL: smtp.starttls()
            if settings.SMTP_USER: smtp.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            smtp.send_message(message)
        return 'sent'
    except (OSError, smtplib.SMTPException): return 'failed'

async def notify_lead(lead_id):
    db = get_db(); lead = await db.leads.find_one({'_id': lead_id})
    if not lead: return 'missing'
    status = await run_in_threadpool(send_lead_notification, lead)
    await db.leads.update_one({'_id': lead_id}, {'$set': {'notificationStatus': status, 'notificationUpdatedAt': now()}, '$inc': {'notificationAttempts': 1}})
    return status
