/**
 * Shared GSAP animation helpers.
 * Matches the existing repo's easing / timing conventions.
 * Every component reuses these instead of defining inline animations.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const EASE_SMOOTH = 'power3.out';
const EASE_CINEMATIC = 'power2.inOut';

/**
 * Reveal element on scroll with translateY + opacity.
 */
export function scrollReveal(element, options = {}) {
  const {
    y = 60,
    duration = 0.9,
    delay = 0,
    start = 'top 85%',
  } = options;

  return gsap.from(element, {
    y,
    opacity: 0,
    duration,
    delay,
    ease: EASE_SMOOTH,
    scrollTrigger: {
      trigger: element,
      start,
      toggleActions: 'play none none none',
    },
  });
}

/**
 * Stagger-reveal a group of elements on scroll.
 */
export function staggerReveal(elements, options = {}) {
  const {
    y = 60,
    duration = 0.9,
    stagger = 0.12,
    start = 'top 85%',
    trigger = null,
  } = options;

  return gsap.from(elements, {
    y,
    opacity: 0,
    duration,
    stagger,
    ease: EASE_SMOOTH,
    scrollTrigger: {
      trigger: trigger || elements[0],
      start,
      toggleActions: 'play none none none',
    },
  });
}

/**
 * Text line reveal with clip-path.
 */
export function clipReveal(element, options = {}) {
  const {
    duration = 1.2,
    delay = 0,
    start = 'top 85%',
  } = options;

  return gsap.from(element, {
    clipPath: 'inset(100% 0 0 0)',
    opacity: 0,
    duration,
    delay,
    ease: EASE_CINEMATIC,
    scrollTrigger: {
      trigger: element,
      start,
      toggleActions: 'play none none none',
    },
  });
}

/**
 * Subtle parallax on scroll (≤ 8%).
 */
export function parallax(element, options = {}) {
  const {
    y = '8%',
    start = 'top bottom',
    end = 'bottom top',
  } = options;

  return gsap.fromTo(element,
    { y: `-${y}` },
    {
      y,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start,
        end,
        scrub: true,
      },
    }
  );
}

/**
 * Stagger text — reveals words/chars one by one.
 */
export function staggerText(elements, options = {}) {
  const {
    duration = 0.8,
    stagger = 0.1,
    start = 'top 85%',
    trigger = null,
  } = options;

  return gsap.from(elements, {
    y: 40,
    opacity: 0,
    duration,
    stagger,
    ease: EASE_SMOOTH,
    scrollTrigger: {
      trigger: trigger || elements[0],
      start,
      toggleActions: 'play none none none',
    },
  });
}
