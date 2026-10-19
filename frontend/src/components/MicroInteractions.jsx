import React, { useEffect, useRef } from 'react';

const MicroInteractions = () => {
  const observerRef = useRef(null);

  useEffect(() => {
    // Scroll-triggered reveal animations via IntersectionObserver
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .line-expand');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
    );

    function observe(elements) {
      elements.forEach(el => {
        if (prefersReducedMotion) el.classList.add('visible');
        else observerRef.current.observe(el);
      });
    }
    observe(revealElements);
    // CMS projects arrive after the initial render. Include their existing animations.
    const added = new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
      if (node.nodeType !== 1) return;
      if (node.matches('.reveal, .reveal-left, .reveal-right, .reveal-scale, .line-expand')) observe([node]);
      observe(node.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .line-expand'));
    })));
    added.observe(document.getElementById('main-content'), { childList: true, subtree: true });

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
      added.disconnect();
    };
  }, []);

  return null;
};

export default MicroInteractions;
