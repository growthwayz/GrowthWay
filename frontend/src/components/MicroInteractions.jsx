import React, { useEffect, useRef } from 'react';

const MicroInteractions = () => {
  const cursorRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;

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
      {/* Grain Texture */}
      <div className="noise-overlay"></div>
    </>
  );
};

export default MicroInteractions;
