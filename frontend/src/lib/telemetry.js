/**
 * Telemetry & event tracking helper
 * Safely wraps analytics/GA4 calls without triggering ad-blocker filters.
 */

const getMeasurementId = () => (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_GA_MEASUREMENT_ID : undefined);

export const initTelemetry = () => {
  const id = getMeasurementId();
  if (!id || typeof window === 'undefined') return;
  
  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', id, { send_page_view: false });
  window.gtag = gtag;
};

export const trackEvent = (eventName, params = {}) => {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, params);
    }
  } catch (err) {
    // Non-blocking telemetry error suppression
  }
};

export const trackPageView = (url) => {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      const id = getMeasurementId();
      if (id) {
        window.gtag('config', id, { page_path: url });
      }
    }
  } catch (err) {
    // Non-blocking telemetry error suppression
  }
};

// Aliases for compatibility
export const initAnalytics = initTelemetry;
