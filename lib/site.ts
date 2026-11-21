/**
 * Single source of truth for launch details and contact points.
 * Everything a non-developer may need to change lives here or in `.env.local`.
 */
export const siteConfig = {
  name: "Egypt Origin",
  tagline: "Ancient Egypt. Modern logistics.",
  description:
    "A private travel atelier for Egypt: routes drawn with Egyptologists, quiet access to the sites, and one planner throughout. Opening Soon.",
  /** Countdown target. Override with NEXT_PUBLIC_LAUNCH_DATE. */
  launchDateISO:
    process.env.NEXT_PUBLIC_LAUNCH_DATE ?? "2027-01-15T18:00:00+02:00",
  /** Human-readable date shown beside the countdown (kept static for SSR). */
  launchLabel: process.env.NEXT_PUBLIC_LAUNCH_LABEL ?? "15 January 2027",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://egyptorigin.com",
  email: "hello@egyptorigin.com",
  instagram: "https://instagram.com/egyptorigin",
} as const;
