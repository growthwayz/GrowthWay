import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('gw_admin_token');
    navigate('/admin');
  };

  const navItems = [
    { label: 'Intelligence & Analytics', path: '/admin/dashboard', icon: '✦', active: true },
    { label: 'Live Client Inquiries', path: '/admin/dashboard', icon: '◈', active: true },
    { label: 'Case Study Vault', path: '#', icon: '❖', disabled: true },
    { label: 'Studio Settings', path: '#', icon: '⚙', disabled: true },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex font-sans text-[#111111]">
      {/* Executive Sidebar */}
      <aside className="w-72 bg-[#141413] text-[#FAF8F5] border-r border-[#262624] flex flex-col shrink-0 select-none">
        {/* Brand Header */}
        <div className="p-6 border-b border-[#262624]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-black/40 border border-[#333330] p-1 flex items-center justify-center">
              <img
                src="/logo-icon.png"
                alt="GrowthWay"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm tracking-widest uppercase text-white">
                  GROWTHWAY
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#5C9E31]/20 text-[#5C9E31] border border-[#5C9E31]/30">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-[#888884] font-mono tracking-wider uppercase mt-0.5">
                Executive Control Hub
              </p>
            </div>
          </div>
        </div>

        {/* Studio Status Pill */}
        <div className="px-6 py-4 border-b border-[#262624]/60 bg-[#1A1A18]/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#5C9E31] animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#C4C4BD]">
              Studio Ingestion Live
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#5C9E31] font-semibold">
            99.9% SLA
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 flex flex-col gap-1.5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#777772] px-3 py-2">
            Executive Portals
          </span>
          {navItems.map((item, idx) => (
            item.disabled ? (
              <div
                key={idx}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium text-[#555550] cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs opacity-50">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-[#666660]">
                  Soon
                </span>
              </div>
            ) : (
              <Link
                key={idx}
                to={item.path}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 bg-[#5C9E31]/15 text-white border border-[#5C9E31]/30 shadow-sm"
              >
                <span className="text-[#5C9E31] text-xs font-bold">{item.icon}</span>
                <span className="tracking-wide">{item.label}</span>
              </Link>
            )
          ))}

          <div className="my-3 border-t border-[#262624]" />

          <span className="text-[10px] font-mono uppercase tracking-widest text-[#777772] px-3 py-1">
            Shortcuts
          </span>

          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium text-[#C4C4BD] hover:text-white hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs">↗</span>
              <span>View Public Studio</span>
            </div>
            <span className="text-[10px] font-mono text-[#888884]">Live</span>
          </Link>
        </nav>

        {/* User Badge & Logout */}
        <div className="p-4 border-t border-[#262624] bg-[#171716] flex flex-col gap-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-[#5C9E31]/20 border border-[#5C9E31]/40 flex items-center justify-center font-mono text-xs font-bold text-[#5C9E31]">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white truncate">Administrator</div>
              <div className="text-[10px] font-mono text-[#888884] truncate">admin@growthway.agency</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 flex items-center justify-center gap-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg border border-red-500/20 transition-colors"
          >
            <span>Disconnect Session</span>
            <span className="font-mono text-[10px]">⏻</span>
          </button>
        </div>
      </aside>

      {/* Main Studio Telemetry Viewport */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
