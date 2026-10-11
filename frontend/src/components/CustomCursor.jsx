import React, { useEffect, useRef } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouchDevice || prefersReducedMotion) return;

    // Add global body class to hide default cursor
    document.body.classList.add('custom-cursor-enabled');

    const onMouseMove = (e) => {
      // Use requestAnimationFrame for smoother DOM writes
      requestAnimationFrame(() => {
        if (dotRef.current) {
          dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
        }
        if (ringRef.current) {
          ringRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
        }
      });
    };

    document.addEventListener('mousemove', onMouseMove);

    // Event delegation for hover states
    const handleMouseOver = (e) => {
      const target = e.target;
      // Also check if any parent has the class, or if it's an 'a' or 'button'
      if (
        target.closest('.cursor-hover') || 
        target.closest('.magnetic-card') ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.nav-item-container')
      ) {
        document.body.classList.add('cursor-hover');
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target;
      if (
        target.closest('.cursor-hover') || 
        target.closest('.magnetic-card') ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.nav-item-container')
      ) {
        document.body.classList.remove('cursor-hover');
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.body.classList.remove('custom-cursor-enabled');
      document.body.classList.remove('cursor-hover');
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="custom-cursor-dot"></div>
      <div ref={ringRef} className="custom-cursor-ring"></div>
    </>
  );
}
