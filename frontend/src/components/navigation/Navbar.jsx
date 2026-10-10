import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';

const WorkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"></rect>
    <rect x="14" y="3" width="7" height="7" rx="1"></rect>
    <rect x="14" y="14" width="7" height="7" rx="1"></rect>
    <rect x="3" y="14" width="7" height="7" rx="1"></rect>
  </svg>
);

const ServicesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const AboutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const ContactIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
    <path d="M2 4l10 8 10-8"></path>
  </svg>
);

const NavItem = ({ name, href, active, mouseX, icon: Icon }) => {
  const itemRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  let scale = 1;
  let translateY = 0;
  let isHovered = false;

  if (mouseX !== null && itemRef.current) {
    const rect = itemRef.current.getBoundingClientRect();
    const itemCenterX = rect.left + rect.width / 2;
    const distance = Math.abs(mouseX - itemCenterX);

    // Max distance for interaction
    const maxDistance = 120;

    if (distance < maxDistance) {
      // Ease function for smooth falloff
      const ease = Math.max(0, 1 - distance / maxDistance);
      scale = 1 + ease * 0.15; // up to 1.15
      translateY = ease * -4; // up to -4px

      // Determine if this is the "hovered" item
      isHovered = distance < (rect.width / 2 + 15);
    }
  }

  const effectiveHover = isHovered || isFocused;

  // Handle prefers-reduced-motion
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    scale = 1;
    translateY = 0;
  }

  const handleClick = (e) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const targetTop = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
      // Optionally update the URL silently
      window.history.pushState(null, '', href);
    }
  };

  return (
    <div
      ref={itemRef}
      className={`nav-item-container ${effectiveHover ? 'is-hovered' : ''} ${active ? 'nav-item-active' : ''}`}
      style={{
        transform: `translateY(${translateY}px) scale(${scale})`
      }}
    >
      <div className="nav-hover-capsule"></div>
      <a
        href={href}
        className="nav-link-icon relative focus:outline-none flex flex-col items-center justify-center"
        aria-label={name}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onClick={handleClick}
      >
        <Icon />
        <span className="nav-hover-dot"></span>
        <span className="nav-hover-label">{name}</span>
      </a>
    </div>
  );
};

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mouseX, setMouseX] = useState(null);
  const navContainerRef = useRef(null);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll and handle Escape key
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';

      const handleEscape = (e) => {
        if (e.key === 'Escape') setIsMobileMenuOpen(false);
      };
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscape);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'WORK', href: '#work', active: false, icon: WorkIcon },
    { name: 'SERVICES', href: '#services', active: true, icon: ServicesIcon },
    { name: 'ABOUT', href: '#about', active: false, icon: AboutIcon },
    { name: 'CONTACT', href: '#contact', active: false, icon: ContactIcon },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-6 flex justify-center pointer-events-none">
      <nav
        ref={navContainerRef}
        className={`navbar-container navbar-glass mx-auto flex items-center gap-4 lg:gap-8 pointer-events-auto ${scrolled ? 'navbar-scrolled' : 'navbar-top'}`}
        onMouseMove={(e) => setMouseX(e.clientX)}
        onMouseLeave={() => setMouseX(null)}
      >
        {/* Logo */}
        <div className="flex-shrink-0 z-50">
          <a href="/" className="text-[20px] font-display font-extrabold tracking-tight text-[#171717] hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#3D4A36] rounded-sm">
            Growthway<span className="text-[#641F2B]">.</span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-[4px] relative z-10 bg-transparent rounded-full px-2">
          {navLinks.map((link) => (
            <NavItem
              key={link.name}
              name={link.name}
              href={link.href}
              active={link.active}
              mouseX={mouseX}
              icon={link.icon}
            />
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center z-50">
          <a
            href="/#start-project"
            className="cta-button font-medium flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#3D4A36]"
          >
            START A PROJECT
            <span className="cta-arrow">→</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden z-50 p-2 -mr-2 text-[#111111] focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 mobile-menu-glass transition-all duration-500 ease-in-out md:hidden flex flex-col justify-center px-8 pointer-events-auto ${isMobileMenuOpen ? 'opacity-100 visible mobile-menu-open' : 'opacity-0 invisible'
          }`}
      >
        <nav className="flex flex-col gap-6 mt-16">
          {navLinks.map((link, index) => (
            <a
              key={link.name}
              href={link.href}
              className={`mobile-nav-item delay-${index + 1} text-4xl font-display font-medium text-[#171717] hover:text-[#3D4A36] transition-colors focus:text-[#3D4A36] focus:font-bold focus:outline-none flex items-center gap-4`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <link.icon />
              {link.name}
            </a>
          ))}
          <div className={`mobile-nav-item delay-5 mt-12`}>
            <a
              href="/#start-project"
              className="inline-flex items-center gap-2 cta-button px-8 py-4 text-lg font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              START A PROJECT
              <span className="cta-arrow">→</span>
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
