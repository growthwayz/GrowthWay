import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const btnRef = useRef(null);

  const handleMagneticMove = (e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
  };

  const handleMagneticLeave = () => {
    const btn = btnRef.current;
    if (btn) btn.style.transform = 'translate(0px, 0px)';
  };

  return (
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 bg-gw-black/40 backdrop-blur-2xl border border-white/[0.06] px-8 md:px-10 py-4 rounded-full flex justify-between items-center w-[92%] max-w-[1200px] z-50 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
      <div className="font-display font-bold text-xl text-gw-white">
        <Link to="/" className="interactive-hover tracking-tight">
          Growthway<span className="text-gw-pink">.</span>
        </Link>
      </div>
      
      <div className="hidden md:flex gap-8 text-[13px] tracking-[0.15em] uppercase font-medium text-gw-white/60">
        <Link to="/work" className="interactive-hover hover:text-gw-white transition-colors duration-300">Work</Link>
        <span className="interactive-hover hover:text-gw-white transition-colors duration-300">Services</span>
        <span className="interactive-hover hover:text-gw-white transition-colors duration-300">About</span>
      </div>
      
      {/* Magnetic Wrapper */}
      <div 
        className="inline-block p-5 -m-5"
        onMouseMove={handleMagneticMove}
        onMouseLeave={handleMagneticLeave}
      >
        <div 
          ref={btnRef}
          className="bg-gw-white text-gw-ink px-6 py-2.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.15em] interactive-hover transition-all duration-400 ease-out inline-block hover:bg-gw-pink hover:text-white"
          style={{ transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s, color 0.3s' }}
        >
          Start a Project
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
