import React, { useRef, useCallback } from 'react';

const TiltCard = ({ children, className = '', intensity = 12 }) => {
  const cardRef = useRef(null);
  const innerRef = useRef(null);
  const glareRef = useRef(null);
  const rafRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const inner = innerRef.current;
    const glare = glareRef.current;
    if (!inner) return;

    // Cancel any pending frame for smoothness
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const rect = inner.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -intensity;
      const rotateY = ((x - centerX) / centerX) * intensity;

      inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      inner.style.boxShadow = `${-rotateY * 1.5}px ${rotateX * 1.5}px 50px rgba(0,0,0,0.18)`;

      if (glare) {
        glare.style.opacity = '1';
        glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.25), transparent 55%)`;
      }
    });
  }, [intensity]);

  const handleMouseLeave = useCallback(() => {
    const inner = innerRef.current;
    const glare = glareRef.current;
    if (!inner) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    inner.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s ease';
    inner.style.transform = 'rotateX(0deg) rotateY(0deg)';
    inner.style.boxShadow = '0 20px 50px rgba(0,0,0,0.08)';

    if (glare) glare.style.opacity = '0';

    setTimeout(() => {
      if (inner) inner.style.transition = 'transform 0.08s linear, box-shadow 0.15s ease';
    }, 600);
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`tilt-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={innerRef} className="tilt-card-inner">
        <div ref={glareRef} className="tilt-card-glare"></div>
        {children}
      </div>
    </div>
  );
};

export default TiltCard;
