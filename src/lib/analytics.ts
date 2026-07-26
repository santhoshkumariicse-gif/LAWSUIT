/**
 * Mock Analytics Integration (e.g., PostHog, Google Analytics)
 */
export const Analytics = {
  init: () => {
    console.log("[Analytics] Initialized");
  },
  trackPageview: (url: string) => {
    if (process.env.NODE_ENV === "production") {
      // e.g. posthog.capture('$pageview')
    }
    console.info(`[Analytics Mock] Pageview: ${url}`);
  },
  trackEvent: (eventName: string, properties?: Record<string, any>) => {
    if (process.env.NODE_ENV === "production") {
      // e.g. posthog.capture(eventName, properties)
    }
    console.info(`[Analytics Mock] Event: ${eventName}`, properties);
  }
};
