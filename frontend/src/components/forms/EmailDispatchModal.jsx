import React, { useState, useEffect } from 'react';
import './EmailDispatchModal.css';

export default function EmailDispatchModal({ isOpen, onClose, email = 'growthway75@gmail.com' }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const subject = encodeURIComponent('Project Commission Inquiry // GrowthWay');
  const body = encodeURIComponent("Hi GrowthWay Team,\n\nI would like to discuss a project commission for our brand.\n\nLooking forward to hearing from you,\n");

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${subject}&body=${body}`;
  const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(email)}&subject=${subject}&body=${body}`;
  const defaultMailUrl = `mailto:${email}?subject=${subject}&body=${body}`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = email;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="edm-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Direct Email Dispatch"
    >
      <div className="edm-dialog">
        {/* Top Header Bar */}
        <div className="edm-header">
          <div className="edm-eyebrow">
            <span className="edm-dot" />
            <span>DIRECT EMAIL DISPATCH // PROTOCOL</span>
          </div>
          <button
            type="button"
            className="edm-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Recipient Display Box */}
        <div className="edm-recipient-box">
          <div className="edm-recipient-info">
            <span className="edm-label">RECIPIENT INBOX (PRE-FILLED IN TO:)</span>
            <span className="edm-email-address">{email}</span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className={`edm-copy-btn ${copied ? 'edm-copied' : ''}`}
            title="Copy email address"
          >
            {copied ? (
              <>
                <svg viewBox="0 0 24 24" className="edm-icon"><polyline points="20 6 9 17 4 12" /></svg>
                <span>COPIED!</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="edm-icon"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                <span>COPY</span>
              </>
            )}
          </button>
        </div>

        <p className="edm-subtext">
          Select your preferred email provider below. The recipient (<strong>{email}</strong>) and project inquiry details will be automatically pre-filled in your compose window.
        </p>

        {/* Dispatch Options */}
        <div className="edm-actions">
          {/* Primary Option: Gmail Web */}
          <a
            href={gmailUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="edm-action-btn edm-primary"
            onClick={onClose}
          >
            <div className="edm-btn-left">
              <span className="edm-provider-icon gmail-icon">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#EA4335" d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 6l8 5 8-5v2l-8 5-8-5V6z"/>
                </svg>
              </span>
              <div>
                <span className="edm-btn-title">Open in Gmail (Web)</span>
                <span className="edm-btn-desc">Opens Gmail Compose with "To:" pre-filled in a new tab</span>
              </div>
            </div>
            <span className="edm-arrow">→</span>
          </a>

          {/* Option 2: Default System Client */}
          <a
            href={defaultMailUrl}
            className="edm-action-btn"
            onClick={onClose}
          >
            <div className="edm-btn-left">
              <span className="edm-provider-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              <div>
                <span className="edm-btn-title">Open Default Mail App</span>
                <span className="edm-btn-desc">Windows Mail, Apple Mail, Outlook Desktop, Thunderbird</span>
              </div>
            </div>
            <span className="edm-arrow">→</span>
          </a>

          {/* Option 3: Outlook Web */}
          <a
            href={outlookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="edm-action-btn"
            onClick={onClose}
          >
            <div className="edm-btn-left">
              <span className="edm-provider-icon outlook-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="#0078D4">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM13 3.5L18.5 9H13V3.5zM6 20V4h5v6h6v10H6z"/>
                </svg>
              </span>
              <div>
                <span className="edm-btn-title">Open in Outlook Web</span>
                <span className="edm-btn-desc">Outlook.com / Office 365 web compose</span>
              </div>
            </div>
            <span className="edm-arrow">→</span>
          </a>
        </div>

        {/* SLA Guarantee Note */}
        <div className="edm-footer-note">
          <span className="edm-dot-static" />
          <span>SLA Guarantee: Inquiries are reviewed and answered within 24 business hours.</span>
        </div>
      </div>
    </div>
  );
}
