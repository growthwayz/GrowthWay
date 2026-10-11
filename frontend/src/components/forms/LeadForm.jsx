/**
 * LeadForm — Item 28
 * Editorial, designer-grade briefing & lead intake form.
 * Features:
 * - Underline-style inputs with animated focus lines
 * - Interactive tactile chips for business type, services, budget, and timeline
 * - Accessible ARIA attributes and keyboard navigation
 * - Anti-spam honeypot and hidden campaign metadata
 * - Direct GA4 analytics event tracking on success
 * - Luxury confirmation screen with direct WhatsApp fast-track
 */

import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { trackEvent } from '../../lib/telemetry';
import './LeadForm.css';

const DEFAULT_SERVICES = [
  { slug: 'brand-strategy', title: 'Brand Strategy & Identity' },
  { slug: 'creative-direction', title: 'Creative Direction' },
  { slug: 'web-design-dev', title: 'Web Design & Engineering' },
  { slug: 'growth-marketing', title: 'Performance & Growth' },
  { slug: 'content-production', title: 'Content & Visual Media' },
  { slug: 'social-presence', title: 'Organic Social & Story' },
];

const BUSINESS_TYPES = [
  { value: 'startup', label: 'Startup & Tech' },
  { value: 'ecommerce', label: 'D2C & E-Commerce' },
  { value: 'hospitality', label: 'Hospitality & F&B' },
  { value: 'b2b', label: 'B2B & Enterprise' },
  { value: 'personal-brand', label: 'Personal Brand & Creator' },
  { value: 'other', label: 'Other Venture' },
];

const BUDGET_RANGES = [
  { value: '<5k', label: 'Under $5,000' },
  { value: '5k-10k', label: '$5,000 — $10,000' },
  { value: '10k-25k', label: '$10,000 — $25,000' },
  { value: '>25k', label: '$25,000+' },
];

const TIMELINE_OPTIONS = [
  { value: 'asap', label: 'Immediate / ASAP' },
  { value: '1-2-months', label: '1 — 2 Months' },
  { value: '3-6-months', label: '3 — 6 Months' },
  { value: 'flexible', label: 'Flexible Window' },
];

export default function LeadForm() {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    email: '',
    phone: '',
    businessType: 'startup',
    servicesNeeded: [],
    budgetRange: '5k-10k',
    timeline: '1-2-months',
    projectDescription: '',
    consent: true,
    website_fax_hp: '', // Honeypot
  });

  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState('');
  const [referenceId, setReferenceId] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.get('/api/services');
        if (Array.isArray(data) && data.length > 0) {
          setServices(data);
        }
      } catch {
        // Keep DEFAULT_SERVICES on error or cold start
      }
    };
    fetchServices();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'consent') {
        setFormData((prev) => ({ ...prev, [name]: checked }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const toggleService = (slug) => {
    setFormData((prev) => {
      const exists = prev.servicesNeeded.includes(slug);
      const updated = exists
        ? prev.servicesNeeded.filter((s) => s !== slug)
        : [...prev.servicesNeeded, slug];
      return { ...prev, servicesNeeded: updated };
    });
  };

  const selectBusinessType = (val) => {
    setFormData((prev) => ({ ...prev, businessType: val }));
  };

  const selectBudget = (val) => {
    setFormData((prev) => ({ ...prev, budgetRange: val }));
  };

  const selectTimeline = (val) => {
    setFormData((prev) => ({ ...prev, timeline: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Honeypot spam trap check
    if (formData.website_fax_hp) {
      setStatus('success');
      return;
    }

    if (formData.servicesNeeded.length === 0) {
      setErrorMessage('Please select at least one service of interest.');
      setStatus('error');
      return;
    }

    if (!formData.name.trim() || !formData.brand.trim() || !formData.email.trim()) {
      setErrorMessage('Please fill in your name, brand, and email address.');
      setStatus('error');
      return;
    }

    if (!formData.projectDescription.trim()) {
      setErrorMessage('Please provide a brief summary of your project vision.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const payload = {
        name: formData.name.trim(),
        brand: formData.brand.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        businessType: formData.businessType,
        servicesNeeded: formData.servicesNeeded,
        budgetRange: formData.budgetRange || null,
        timeline: formData.timeline || null,
        projectDescription: formData.projectDescription.trim(),
        consent: formData.consent,
      };

      const res = await api.post('/api/leads', payload);
      const generatedRef = res?.id ? res.id.slice(-6).toUpperCase() : Math.random().toString(36).substring(2, 8).toUpperCase();
      setReferenceId(generatedRef);

      // Track analytics event (Phase F requirement)
      trackEvent('enquiry_submitted', {
        business_type: formData.businessType,
        services_count: formData.servicesNeeded.length,
        budget_range: formData.budgetRange,
      });

      setStatus('success');
    } catch (err) {
      setErrorMessage(err.data?.error?.message || 'We could not submit your brief. Please verify connection and retry.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    const whatsappText = encodeURIComponent(
      `Hello Growthway! I just submitted project brief #${referenceId} for ${formData.brand} (${formData.name}). Looking forward to connecting!`
    );
    const whatsappFastTrackUrl = `https://wa.me/919876543210?text=${whatsappText}`;

    return (
      <div className="lf-success-card" aria-live="polite">
        <div className="lf-success-eyebrow">
          <span className="lf-success-dot" />
          <span>Protocol 01 // Submission Received</span>
        </div>

        <h3 className="lf-success-title">
          We’ll take it <br />
          <span className="text-gw-olive">from here.</span>
        </h3>

        <div className="lf-success-meta">
          <div className="lf-meta-item">
            <span className="lf-meta-label">Reference ID</span>
            <span className="lf-meta-val font-mono">GW-{referenceId}</span>
          </div>
          <div className="lf-meta-item">
            <span className="lf-meta-label">Client / Entity</span>
            <span className="lf-meta-val">{formData.brand}</span>
          </div>
          <div className="lf-meta-item">
            <span className="lf-meta-label">Response Time</span>
            <span className="lf-meta-val">Within 24 Hours</span>
          </div>
        </div>

        <p className="lf-success-description">
          Your project parameters have entered our direct studio intake queue. Our founders and lead strategist review each dossier prior to our discovery exchange.
        </p>

        <div className="lf-success-actions">
          <a
            href={whatsappFastTrackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="lf-fasttrack-btn"
          >
            <span>Fast-track via WhatsApp</span>
            <span className="lf-arrow">→</span>
          </a>

          <button
            type="button"
            onClick={() => {
              setStatus('idle');
              setFormData({
                name: '',
                brand: '',
                email: '',
                phone: '',
                businessType: 'startup',
                servicesNeeded: [],
                budgetRange: '5k-10k',
                timeline: '1-2-months',
                projectDescription: '',
                consent: true,
                website_fax_hp: '',
              });
            }}
            className="lf-reset-btn"
          >
            Submit Another Brief
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="lf-form" onSubmit={handleSubmit} noValidate>
      {/* Honeypot field for bot protection */}
      <input
        type="text"
        name="website_fax_hp"
        value={formData.website_fax_hp}
        onChange={handleChange}
        style={{ display: 'none', position: 'absolute', left: '-9999px' }}
        tabIndex="-1"
        autoComplete="off"
        aria-hidden="true"
      />

      {/* SECTION 01: Collaborators */}
      <div className="lf-section">
        <div className="lf-section-header">
          <span className="lf-step-index">01</span>
          <div>
            <h3 className="lf-section-title">The Collaborators</h3>
            <p className="lf-section-sub">Who are we creating with?</p>
          </div>
        </div>

        <div className="lf-grid">
          <div className="lf-field">
            <label htmlFor="name" className="lf-label">
              Your Name <span className="lf-req">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Maya Chen"
              className="lf-input"
            />
            <span className="lf-line-focus" />
          </div>

          <div className="lf-field">
            <label htmlFor="brand" className="lf-label">
              Brand / Company <span className="lf-req">*</span>
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              required
              value={formData.brand}
              onChange={handleChange}
              placeholder="e.g. Atelier Aurelia"
              className="lf-input"
            />
            <span className="lf-line-focus" />
          </div>

          <div className="lf-field">
            <label htmlFor="email" className="lf-label">
              Work Email <span className="lf-req">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="maya@aurelia.com"
              className="lf-input"
            />
            <span className="lf-line-focus" />
          </div>

          <div className="lf-field">
            <label htmlFor="phone" className="lf-label">
              Phone / WhatsApp <span className="lf-opt">(Optional)</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="lf-input"
            />
            <span className="lf-line-focus" />
          </div>
        </div>
      </div>

      {/* SECTION 02: Classification */}
      <div className="lf-section">
        <div className="lf-section-header">
          <span className="lf-step-index">02</span>
          <div>
            <h3 className="lf-section-title">Venture & Objectives</h3>
            <p className="lf-section-sub">Categorization and required agency disciplines</p>
          </div>
        </div>

        {/* Business Type Chips */}
        <div className="lf-subgroup">
          <label className="lf-label">
            Industry Classification <span className="lf-req">*</span>
          </label>
          <div className="lf-pill-grid" role="radiogroup" aria-label="Industry classification">
            {BUSINESS_TYPES.map((bt) => {
              const isSelected = formData.businessType === bt.value;
              return (
                <button
                  type="button"
                  key={bt.value}
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => selectBusinessType(bt.value)}
                  className={`lf-pill-btn ${isSelected ? 'is-selected' : ''}`}
                >
                  <span className="lf-pill-dot" />
                  {bt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Services Needed Chips */}
        <div className="lf-subgroup">
          <label className="lf-label">
            Disciplines Required <span className="lf-req">*</span>
            <span className="lf-label-hint">Select all areas of focus</span>
          </label>
          <div className="lf-chips-grid" role="group" aria-label="Services needed">
            {services.map((s) => {
              const isSelected = formData.servicesNeeded.includes(s.slug);
              return (
                <button
                  type="button"
                  key={s.slug}
                  role="checkbox"
                  aria-checked={isSelected}
                  onClick={() => toggleService(s.slug)}
                  className={`lf-chip-card ${isSelected ? 'is-active' : ''}`}
                >
                  <div className="lf-chip-check">
                    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3.5 8.5 6.5 11.5 12.5 4.5" />
                    </svg>
                  </div>
                  <span className="lf-chip-title">{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 03: Parameters */}
      <div className="lf-section">
        <div className="lf-section-header">
          <span className="lf-step-index">03</span>
          <div>
            <h3 className="lf-section-title">Investment & Horizon</h3>
            <p className="lf-section-sub">Anticipated capital allocation and launch window</p>
          </div>
        </div>

        <div className="lf-split-row">
          {/* Budget pills */}
          <div className="lf-subgroup lf-half">
            <label className="lf-label">
              Capital Range <span className="lf-opt">(USD Equivalent)</span>
            </label>
            <div className="lf-segmented-grid" role="radiogroup" aria-label="Budget range">
              {BUDGET_RANGES.map((b) => {
                const isSelected = formData.budgetRange === b.value;
                return (
                  <button
                    type="button"
                    key={b.value}
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => selectBudget(b.value)}
                    className={`lf-segment-btn ${isSelected ? 'is-selected' : ''}`}
                  >
                    {b.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Timeline pills */}
          <div className="lf-subgroup lf-half">
            <label className="lf-label">
              Delivery Horizon <span className="lf-opt">(Target Timeline)</span>
            </label>
            <div className="lf-segmented-grid" role="radiogroup" aria-label="Delivery horizon">
              {TIMELINE_OPTIONS.map((t) => {
                const isSelected = formData.timeline === t.value;
                return (
                  <button
                    type="button"
                    key={t.value}
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => selectTimeline(t.value)}
                    className={`lf-segment-btn ${isSelected ? 'is-selected' : ''}`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 04: Brief Narrative */}
      <div className="lf-section">
        <div className="lf-section-header">
          <span className="lf-step-index">04</span>
          <div>
            <h3 className="lf-section-title">The Narrative</h3>
            <p className="lf-section-sub">Describe your vision, core challenge, and expected outcomes</p>
          </div>
        </div>

        <div className="lf-field">
          <label htmlFor="projectDescription" className="lf-label">
            Project Overview <span className="lf-req">*</span>
          </label>
          <textarea
            id="projectDescription"
            name="projectDescription"
            required
            rows="4"
            value={formData.projectDescription}
            onChange={handleChange}
            placeholder="Tell us about the current state, what transformation you're seeking, and what a wildly successful collaboration looks like..."
            className="lf-textarea"
          />
          <span className="lf-line-focus" />
        </div>

        <div className="lf-consent-wrap">
          <label className="lf-consent-label">
            <input
              type="checkbox"
              name="consent"
              required
              checked={formData.consent}
              onChange={handleChange}
              className="lf-consent-checkbox"
            />
            <span className="lf-consent-box">
              <svg viewBox="0 0 16 16" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3.5 8.5 6.5 11.5 12.5 4.5" />
              </svg>
            </span>
            <span className="lf-consent-text">
              I consent to Growthway reviewing and storing these credentials for the purpose of project discovery under our strict client confidentiality protocol.
            </span>
          </label>
        </div>
      </div>

      {/* Error readout */}
      {status === 'error' && (
        <div className="lf-error-banner" role="alert">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Action footer */}
      <div className="lf-footer">
        <button
          type="submit"
          className="lf-submit-btn group"
          disabled={status === 'submitting'}
        >
          <span className="lf-submit-text">
            {status === 'submitting' ? 'Transmitting Brief...' : 'Transmit Project Brief'}
          </span>
          <span className="lf-submit-arrow group-hover:translate-x-1.5 transition-transform duration-300">
            →
          </span>
        </button>

        <p className="lf-privacy-note">
          Direct studio dispatch · Direct review by founders · Typical turnaround &lt; 24h
        </p>
      </div>
    </form>
  );
}
