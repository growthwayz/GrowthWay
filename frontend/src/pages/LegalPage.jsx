import { Link, useNavigate } from 'react-router-dom'
import { usePublicCms } from '../lib/publicCms'

const defaults = {
  privacy: {
    title: 'Privacy Policy',
    body: 'We use the contact details and project information you submit to respond to your enquiry and discuss your project. Please do not include sensitive personal information. Contact us through this website if you want to request a correction or deletion.',
  },
  terms: {
    title: 'Terms of Service',
    body: 'Project scope, fees, timelines and usage rights are agreed separately before work begins. Portfolio work may include previous engagements and is credited where appropriate.',
  },
}

export default function LegalPage({ type }) {
  const navigate = useNavigate()
  const { data: settings } = usePublicCms('/api/site-settings')
  const fallback = defaults[type] || defaults.privacy
  const body = type === 'terms' ? settings?.termsText || fallback.body : settings?.privacyText || fallback.body

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  return (
    <article className="min-h-screen bg-gw-canvas px-6 pb-24 pt-36 text-gw-ink md:px-18">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-luxury text-gw-olive">Growthway</p>
        <h1 className="mt-5 font-display text-5xl font-bold uppercase tracking-tight md:text-7xl">{fallback.title}</h1>
        <p className="mt-10 max-w-2xl text-base leading-8 text-gw-charcoal">{body}</p>
        <div className="mt-12 flex flex-wrap items-center gap-6">
          <button
            type="button"
            onClick={handleBack}
            className="designer-back-btn group cursor-pointer"
            aria-label="Back to Previous Page"
          >
            <span className="back-icon-disc">
              <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </span>
            <span className="back-label">Back to Previous</span>
            <span className="back-tag">RETURN</span>
          </button>

          <Link
            to="/contact"
            className="cta-button font-medium flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-[#3D4A36]"
          >
            <span>START A PROJECT</span>
            <span className="cta-arrow-circle">
              <span className="cta-arrow">→</span>
            </span>
          </Link>
        </div>
      </div>
    </article>
  )
}
