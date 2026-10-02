import React, { useEffect, useRef } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    // Add global body class to hide default cursor
    document.body.classList.add('custom-cursor-enabled');

    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    let animationFrameId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = `${mouseX}px`;
        dotRef.current.style.top = `${mouseY}px`;
      }
    };

    const renderRing = () => {
      ringX += (mouseX - ringX) * 0.2;
      ringY += (mouseY - ringY) * 0.2;
      if (ringRef.current) {
        ringRef.current.style.left = `${ringX}px`;
        ringRef.current.style.top = `${ringY}px`;
      }
      animationFrameId = requestAnimationFrame(renderRing);
    };

    document.addEventListener('mousemove', onMouseMove);
    animationFrameId = requestAnimationFrame(renderRing);

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
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="custom-cursor-dot"></div>
      <div ref={ringRef} className="custom-cursor-ring"></div>
    </>
  );
}
