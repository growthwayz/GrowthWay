"""
Email service using smtplib or a dummy backend for dev.
"""

import smtplib
from email.message import EmailMessage
import logging
from app.core.config import get_settings

logger = logging.getLogger(__name__)

async def send_lead_notification(lead_data: dict):
    """
    Sends an email notification when a new lead is created.
    If SMTP_HOST is empty, simply logs the email (dummy mode).
    """
    settings = get_settings()
    
    subject = f"New Project Enquiry: {lead_data.get('brand')} ({lead_data.get('name')})"
    body = f"""
New Lead Received

Name: {lead_data.get('name')}
Brand: {lead_data.get('brand')}
Email: {lead_data.get('email')}
Phone: {lead_data.get('phone') or 'N/A'}
Business Type: {lead_data.get('businessType')}
Services Needed: {', '.join(lead_data.get('servicesNeeded', []))}
Budget Range: {lead_data.get('budgetRange') or 'N/A'}
Timeline: {lead_data.get('timeline') or 'N/A'}

Description:
{lead_data.get('projectDescription')}
    """
    
    if not settings.SMTP_HOST:
        logger.warning(f"Email Dummy Mode — Would have sent email:\n{subject}\n{body}")
        return True

    msg = EmailMessage()
    msg.set_content(body)
    msg["Subject"] = subject
    msg["From"] = settings.EMAIL_FROM
    msg["To"] = settings.NOTIFICATION_EMAIL or settings.EMAIL_FROM

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
        return True
    except Exception as e:
        logger.error(f"Failed to send email: {e}")
        # We don't want to block lead creation if email fails, so we swallow it and return False
        return False
