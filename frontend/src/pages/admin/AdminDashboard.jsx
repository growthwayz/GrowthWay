import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedBrief, setSelectedBrief] = useState(null);
  const [timeFilter, setTimeFilter] = useState('all');
  const navigate = useNavigate();

  const fetchAnalytics = async () => {
    const token = localStorage.getItem('gw_admin_token');
    if (!token) {
      navigate('/admin');
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/api/admin/analytics', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem('gw_admin_token');
        navigate('/admin');
        return;
      }

      const data = await res.json();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [navigate]);

  const handleStatusChange = async (leadId, newStatus) => {
    const token = localStorage.getItem('gw_admin_token');
    try {
      await fetch(`http://localhost:8000/api/admin/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      // Update in local state instantly
      setAnalytics((prev) => {
        if (!prev) return prev;
        const updatedLeads = prev.recentLeads.map((l) =>
          l.id === leadId ? { ...l, status: newStatus } : l
        );
        return { ...prev, recentLeads: updatedLeads };
      });
    } catch (err) {
      console.error('Failed to update lead status', err);
    }
  };

  if (loading) {
    return (
      <div className="ad-wrapper flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-gw-olive border-t-transparent animate-spin" />
          <span className="font-mono text-xs uppercase tracking-widest text-gw-muted">
            Streaming Intelligence Telemetry...
          </span>
        </div>
      </div>
    );
  }

  const summary = analytics?.summary || {
    totalLeads: 0,
    newLeads: 0,
    wonLeads: 0,
    pipelineValue: 0,
    conversionRate: 0,
    slaAdherence: '98%',
  };

  const pipelineStages = analytics?.pipelineStages || {
    New: 0,
    Contacted: 0,
    Proposal: 0,
    Won: 0,
    Lost: 0,
  };

  const services = analytics?.serviceDistribution || {};
  const maxServiceCount = Math.max(...Object.values(services), 1);

  const budgetDist = analytics?.budgetDistribution || {};
  const totalBudgets = Object.values(budgetDist).reduce((a, b) => a + b, 0) || 1;

  const leads = analytics?.recentLeads || [];
  const filteredLeads =
    activeTab === 'all'
      ? leads
      : leads.filter((l) => l.status.toLowerCase() === activeTab.toLowerCase());

  return (
    <div className="ad-wrapper">
      {/* ── Top Header ── */}
      <div className="ad-header">
        <div>
          <div className="ad-badge">
            <span className="ad-badge-dot animate-pulse" />
            <span>LIVE TELEMETRY · GROWTHWAY STUDIO</span>
          </div>
          <h1 className="ad-title">Intelligence & Analytics</h1>
          <p className="ad-subtitle">
            Executive Acquisition Funnel · Lead Dossiers · Studio Conversion Health
          </p>
        </div>

        <div className="ad-filters">
          {['all', '30d', 'quarterly'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeFilter(tf)}
              className={`ad-filter-pill ${timeFilter === tf ? 'active' : ''}`}
            >
              {tf === 'all' ? 'All-Time' : tf === '30d' ? 'Last 30 Days' : 'Q4 Cycle'}
            </button>
          ))}
        </div>
      </div>

      {/* ── 4 Executive KPI Cards ── */}
      <div className="ad-kpi-grid">
        <div className="ad-kpi-card">
          <div className="ad-kpi-top">
            <span className="ad-kpi-label">Active Pipeline Value</span>
            <span className="ad-kpi-trend">+18.4%</span>
          </div>
          <div className="ad-kpi-val text-gw-olive font-mono">
            ${summary.pipelineValue.toLocaleString()}
          </div>
          <span className="ad-kpi-desc">Estimated value across active deal stages</span>
        </div>

        <div className="ad-kpi-card">
          <div className="ad-kpi-top">
            <span className="ad-kpi-label">Total Inquiries Received</span>
            <span className="ad-kpi-trend">+12 MoM</span>
          </div>
          <div className="ad-kpi-val">{summary.totalLeads}</div>
          <span className="ad-kpi-desc">
            {summary.newLeads} pending review · {summary.contactedLeads || 0} in active discovery
          </span>
        </div>

        <div className="ad-kpi-card">
          <div className="ad-kpi-top">
            <span className="ad-kpi-label">Brief Conversion Rate</span>
            <span className="ad-kpi-trend font-mono">Top Quartile</span>
          </div>
          <div className="ad-kpi-val">{summary.conversionRate}%</div>
          <span className="ad-kpi-desc">Inquiries successfully transitioned to won commissions</span>
        </div>

        <div className="ad-kpi-card">
          <div className="ad-kpi-top">
            <span className="ad-kpi-label">Response Turnaround</span>
            <span className="ad-kpi-trend">&lt; 24h SLA</span>
          </div>
          <div className="ad-kpi-val font-mono">{summary.slaAdherence}</div>
          <span className="ad-kpi-desc">
            Average partner discovery reply under 14.5 hours
          </span>
        </div>
      </div>

      {/* ── Visual Analytics Section (2 Columns) ── */}
      <div className="ad-charts-grid">
        {/* Left Column: Pipeline Stages & Service Demand */}
        <div className="ad-chart-card">
          <div className="ad-chart-header">
            <h3 className="ad-chart-title">Deal Pipeline Architecture</h3>
            <span className="ad-chart-meta">CONVERSION FUNNEL</span>
          </div>

          <div className="ad-pipeline-funnel">
            {Object.entries(pipelineStages).map(([stage, count]) => (
              <div
                key={stage}
                className={`ad-stage-box ${stage === 'New' ? 'active' : ''}`}
              >
                <div className="ad-stage-count">{count}</div>
                <div className="ad-stage-name">{stage}</div>
              </div>
            ))}
          </div>

          <div className="ad-chart-header" style={{ marginTop: '28px' }}>
            <h3 className="ad-chart-title">Disciplines in Demand</h3>
            <span className="ad-chart-meta">SERVICE BREAKDOWN</span>
          </div>

          <div className="ad-bars-list">
            {Object.entries(services).map(([key, count]) => {
              const formattedName = key
                .replace(/-/g, ' ')
                .replace(/\b\w/g, (c) => c.toUpperCase());
              const percent = Math.round((count / maxServiceCount) * 100);

              return (
                <div key={key} className="ad-bar-row">
                  <div className="ad-bar-labels">
                    <span className="font-medium text-xs">{formattedName}</span>
                    <span className="font-mono text-xs text-gw-muted">{count} requests</span>
                  </div>
                  <div className="ad-bar-track">
                    <div className="ad-bar-fill olive" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Capital Spread & Venture Types */}
        <div className="ad-chart-card">
          <div className="ad-chart-header">
            <h3 className="ad-chart-title">Capital Allocation Tier Spread</h3>
            <span className="ad-chart-meta">BUDGET RANGES</span>
          </div>

          <div className="ad-bars-list" style={{ marginBottom: '32px' }}>
            {Object.entries(budgetDist).map(([tier, count]) => {
              const label =
                tier === '<5k'
                  ? 'Under $5,000'
                  : tier === '5k-10k'
                  ? '$5,000 — $10,000'
                  : tier === '10k-25k'
                  ? '$10,000 — $25,000'
                  : '$25,000+ Premium';
              const percent = Math.round((count / totalBudgets) * 100);

              return (
                <div key={tier} className="ad-bar-row">
                  <div className="ad-bar-labels">
                    <span className="font-medium text-xs">{label}</span>
                    <span className="font-mono text-xs text-gw-muted">
                      {count} ({percent}%)
                    </span>
                  </div>
                  <div className="ad-bar-track">
                    <div className="ad-bar-fill" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="ad-chart-header">
            <h3 className="ad-chart-title">Venture Category Distribution</h3>
            <span className="ad-chart-meta">INDUSTRY MIX</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {Object.entries(analytics?.businessTypeDistribution || {}).map(([bt, count]) => {
              const formatted = bt.replace(/-/g, ' ').toUpperCase();
              return (
                <div
                  key={bt}
                  className="px-4 py-2 bg-[#FAF8F5] border border-[#E2DDD5] rounded-sm flex items-center gap-3"
                >
                  <span className="text-xs font-bold text-gw-ink">{formatted}</span>
                  <span className="font-mono text-xs text-gw-olive font-bold">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Live Ingestion & Leads Dossiers Table ── */}
      <div className="ad-table-card">
        <div className="ad-table-header">
          <div>
            <h2 className="font-display font-bold text-lg uppercase tracking-tight text-gw-ink">
              Recent Inquiries & Lead Pipeline
            </h2>
            <p className="text-xs text-gw-muted mt-0.5">
              Live intake from /contact form, WhatsApp fast-lane, and AI brief assistant.
            </p>
          </div>

          <div className="ad-table-filters">
            {['all', 'new', 'contacted', 'proposal', 'won'].map((status) => (
              <button
                key={status}
                onClick={() => setActiveTab(status)}
                className={`ad-tab-btn ${activeTab === status ? 'active' : ''}`}
              >
                {status.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="ad-table-container">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Venture / Client</th>
                <th>Disciplines Needed</th>
                <th>Capital Tier</th>
                <th>Horizon</th>
                <th>Pipeline Status</th>
                <th>Quick Dispatch</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gw-muted">
                    No inquiries currently in this filter stage.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <div className="ad-client-brand">{lead.brand}</div>
                      <div className="ad-client-name">
                        {lead.name} · {lead.businessType?.toUpperCase()}
                      </div>
                    </td>

                    <td>
                      <div className="flex flex-wrap max-w-xs">
                        {lead.servicesNeeded && lead.servicesNeeded.length > 0 ? (
                          lead.servicesNeeded.map((s) => (
                            <span key={s} className="ad-tag-pill">
                              {s.replace(/-/g, ' ')}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gw-muted">Custom Scope</span>
                        )}
                      </div>
                    </td>

                    <td>
                      <span className="font-mono text-xs font-semibold text-gw-ink">
                        {lead.budgetRange || 'Flexible'}
                      </span>
                    </td>

                    <td>
                      <span className="text-xs text-gw-muted font-medium">
                        {lead.timeline || 'Immediate'}
                      </span>
                    </td>

                    <td>
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className={`ad-status-select ${lead.status.toLowerCase()}`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Proposal">Proposal</option>
                        <option value="Won">Won</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </td>

                    <td>
                      <div className="ad-action-btns">
                        {/* View Brief Button */}
                        <button
                          onClick={() => setSelectedBrief(lead)}
                          className="ad-action-icon"
                          title="View Project Brief"
                          aria-label="View Project Brief"
                        >
                          <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>

                        {/* WhatsApp Direct Action */}
                        {lead.phone && (
                          <a
                            href={`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${lead.name}! Priyanka & Ajay here from Growthway regarding your project inquiry for ${lead.brand}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ad-action-icon"
                            title="Chat on WhatsApp"
                            aria-label="Chat on WhatsApp"
                          >
                            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                            </svg>
                          </a>
                        )}

                        {/* Mailto Action */}
                        <a
                          href={`mailto:${lead.email}?subject=${encodeURIComponent(`Growthway Studio Discovery — ${lead.brand}`)}`}
                          className="ad-action-icon"
                          title="Email Client"
                          aria-label="Email Client"
                        >
                          <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Brief Reader Modal Drawer ── */}
      {selectedBrief && (
        <div className="ad-modal-backdrop" onClick={() => setSelectedBrief(null)}>
          <div className="ad-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedBrief(null)}
              className="ad-modal-close"
              aria-label="Close modal"
            >
              ✕
            </button>

            <div className="ad-badge mb-3">
              <span>PROJECT DOSSIER // {selectedBrief.brand.toUpperCase()}</span>
            </div>

            <h3 className="font-display text-2xl font-bold uppercase text-gw-ink mb-1">
              {selectedBrief.brand}
            </h3>
            <p className="text-xs text-gw-muted mb-6">
              Submitted by <b className="text-gw-ink">{selectedBrief.name}</b> ({selectedBrief.email})
            </p>

            <div className="grid grid-cols-2 gap-4 p-4 bg-[#FAF8F5] border border-[#E2DDD5] rounded-sm mb-6 text-xs">
              <div>
                <span className="text-gw-muted block uppercase font-mono text-[10px]">
                  Capital Tier
                </span>
                <span className="font-bold text-gw-ink">{selectedBrief.budgetRange || 'Flexible'}</span>
              </div>
              <div>
                <span className="text-gw-muted block uppercase font-mono text-[10px]">
                  Target Launch Horizon
                </span>
                <span className="font-bold text-gw-ink">{selectedBrief.timeline || 'Immediate'}</span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gw-muted mb-2 font-mono">
                Project Narrative & Objectives
              </h4>
              <p className="text-sm text-gw-ink leading-relaxed bg-[#FFFFFF] p-4 border border-[#EAE6E1] rounded-sm whitespace-pre-wrap">
                {selectedBrief.projectDescription || 'No narrative provided.'}
              </p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-[#EAE6E1]">
              <span className="text-xs text-gw-muted">
                Status: <b className="text-gw-ink">{selectedBrief.status}</b>
              </span>
              <button
                onClick={() => setSelectedBrief(null)}
                className="px-5 py-2.5 bg-gw-ink text-white text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-gw-olive transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
