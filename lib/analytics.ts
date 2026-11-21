type Gtag = (
  command: "js" | "config" | "event" | "set",
  ...args: unknown[]
) => void;

declare global {
  interface Window {
    gtag?: Gtag;
    clarity?: (...args: unknown[]) => void;
  }
}

/** Fire a GA4 event. No-ops when analytics is not configured or blocked. */
export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
}

/** Fire a Microsoft Clarity custom event (usable in filters/funnels). */
export function trackClarityEvent(name: string) {
  if (typeof window === "undefined") return;
  window.clarity?.("event", name);
}
