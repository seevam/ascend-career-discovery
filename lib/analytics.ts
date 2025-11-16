// lib/analytics.ts

export function trackEvent(eventName: string, properties?: Record<string, any>) {
  // Placeholder for analytics tracking
  // Can be integrated with PostHog or Plausible later
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', eventName, properties);
  }
}

export function initAnalytics() {
  // Placeholder for analytics initialization
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics initialized (development mode)');
  }
}
