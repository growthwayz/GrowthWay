import { useEffect } from 'react';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/footer/Footer';
import CustomCursor from '../components/CustomCursor';
import LeadForm from '../components/forms/LeadForm';

export default function ContactPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className="min-h-screen font-sans text-gw-ink flex flex-col"
      style={{
        backgroundColor: '#FAF8F5',
        backgroundImage:
          'linear-gradient(180deg, rgba(92,158,49,0.04) 0%, rgba(250,248,245,0) 500px)',
      }}
    >
      <CustomCursor />
      <Navbar />

      <main className="flex-1" style={{ paddingTop: '120px' }}>
        {/* Top Architectural Banner */}
        <section className="py-12 md:py-20 px-6 md:px-12 lg:px-20 max-w-[1480px] mx-auto border-b border-[#EAE6E1]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-[760px]">
              <div className="flex items-center gap-3 sm:gap-4 text-xs font-bold tracking-[0.25em] text-gw-muted uppercase mb-6">
                <img src="/logo-icon.png" alt="" className="w-5 h-5 rounded-[4px] object-cover shadow-sm" />
                <span className="w-8 h-[1.5px] bg-gw-olive" />
                <span>Studio Commission Intake</span>
                <span className="text-[#D6D0C7]">/</span>
                <span className="font-mono text-gw-olive">PROTOCOL 01</span>
              </div>

              <h1
                className="font-display font-bold uppercase leading-[0.9] tracking-[-0.04em] text-gw-ink"
                style={{ fontSize: 'clamp(2.75rem, 7vw, 6.5rem)' }}
              >
                Ideas to <span className="text-gw-olive">Impact</span>.
              </h1>
            </div>

            {/* Availability Pill */}
            <div className="inline-flex items-center gap-3 bg-[#FFFFFF] border border-[#E2DDD5] px-5 py-3 rounded-full shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-gw-olive animate-pulse" />
              <span className="text-xs font-bold tracking-[0.15em] uppercase text-gw-ink">
                Taking Select Projects for Q4 / Q1
              </span>
            </div>
          </div>
        </section>

        {/* Two-Column Editorial Briefing Canvas */}
        <section className="py-16 md:py-24 px-6 md:px-12 lg:px-20 max-w-[1480px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
            
            {/* Left Column: Studio Intelligence & Coordinates */}
            <div className="lg:col-span-5 flex flex-col gap-12 sticky top-32">
              <div>
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-gw-muted block mb-3 font-mono">
                  00 // Studio Coordinates
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-gw-ink mb-4">
                  Direct Line To Our Partners & Strategists.
                </h2>
                <p className="text-gw-muted text-base leading-relaxed font-body">
                  Growthway operates as an agile, high-conviction creative agency. Every project brief is personally evaluated by our founders to ensure a shared vision of scale and cultural resonance.
                </p>
              </div>

              {/* Coordinates Card */}
              <div className="bg-[#FFFFFF] border border-[#E2DDD5] p-8 rounded-sm shadow-sm flex flex-col gap-6">
                <div className="flex flex-col gap-1.5 border-b border-[#F0ECE6] pb-5">
                  <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-gw-muted">
                    Headquarters & Studios
                  </span>
                  <span className="text-base font-semibold text-gw-ink">
                    Mumbai · Bangalore · Remote Worldwide
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 border-b border-[#F0ECE6] pb-5">
                  <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-gw-muted">
                    Direct Email Dispatch
                  </span>
                  <a
                    href="mailto:hello@growthway.agency"
                    className="text-base font-semibold text-gw-ink hover:text-gw-olive transition-colors flex items-center justify-between group"
                  >
                    <span>hello@growthway.agency</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>

                <div className="flex flex-col gap-1.5 border-b border-[#F0ECE6] pb-5">
                  <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-gw-muted">
                    Direct Telephone Line
                  </span>
                  <a
                    href="tel:+919876543210"
                    className="text-base font-semibold text-gw-ink hover:text-gw-olive transition-colors flex items-center justify-between group"
                  >
                    <span>+91 98765 43210</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-gw-muted">
                    SLA & Turnaround Guarantee
                  </span>
                  <span className="text-sm text-gw-ink font-medium">
                    Initial dossier review & response under 24 business hours.
                  </span>
                </div>
              </div>

              {/* WhatsApp Fast-Lane Card */}
              <div className="bg-[#F5F8F2] border border-[#DDE7D3] p-7 rounded-sm flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-gw-olive" />
                    <span className="text-xs font-bold tracking-wider uppercase text-gw-olive-dark">
                      Instant Messenger
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-lg text-gw-ink">
                    Need an immediate response?
                  </h4>
                  <p className="text-xs text-gw-muted mt-1">
                    Direct WhatsApp concierge with our strategy lead.
                  </p>
                </div>

                <a
                  href="https://wa.me/919876543210?text=Hi%20Growthway!%20I'd%20like%20to%20discuss%20a%20project%20commission."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gw-ink text-white p-3.5 rounded-full hover:bg-gw-olive transition-all flex items-center justify-center shrink-0 shadow-md group"
                  aria-label="Chat on WhatsApp"
                >
                  <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </a>
              </div>

              {/* Architectural Grid Stamp */}
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-[#A8A29A] pt-4 border-t border-[#EAE6E1]">
                <span>Vol. 2026 // Agency Core</span>
                <span>Security: 256-Bit SSL Encrypted</span>
              </div>
            </div>

            {/* Right Column: Art-Directed Editorial LeadForm */}
            <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E2DDD5] p-8 md:p-14 rounded-sm shadow-xl relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gw-olive via-[#A4D481] to-gw-olive opacity-80" />
              <LeadForm />
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
