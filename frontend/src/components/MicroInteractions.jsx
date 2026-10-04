import React, { useEffect, useRef } from 'react';

const MicroInteractions = () => {
  const cursorRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;

    // ── 1. Custom Cursor (uses rAF for 60fps) ──
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const updateCursor = () => {
      cursorX = lerp(cursorX, mouseX, 0.15);
      cursorY = lerp(cursorY, mouseY, 0.15);

      if (cursor) {
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
      }
      requestAnimationFrame(updateCursor);
    };
    requestAnimationFrame(updateCursor);

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // ── 2. Cursor hover states ──
    const handleMouseOver = (e) => {
      if (e.target.closest('.interactive-hover')) {
        cursor?.classList.add('hovering');
      }
    };
    const handleMouseOut = (e) => {
      if (e.target.closest('.interactive-hover')) {
        cursor?.classList.remove('hovering');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    // ── 3. Scroll-triggered reveal animations (IntersectionObserver) ──
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .line-expand');
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el) => observerRef.current.observe(el));

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  // Re-observe when DOM changes (after filter changes)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const revealElements = document.querySelectorAll('.reveal:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible), .reveal-scale:not(.visible), .line-expand:not(.visible)');
      revealElements.forEach((el) => observerRef.current?.observe(el));
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Custom Cursor */}
      <div ref={cursorRef} className="cursor-dot hidden md:block"></div>
      
      {/* Grain Texture */}
      <div className="noise-overlay"></div>
    </>
  );
};

export default MicroInteractions;
