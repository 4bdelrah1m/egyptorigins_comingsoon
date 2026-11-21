# Egypt Origin — Coming Soon

A single-page waitlist / coming-soon landing page for **Egypt Origin**. The design
is deliberately restrained: monochrome print, limestone paper, hairline rules,
technical captions, and a small field plate of Giza. Built with Next.js 16,
React 19, and Tailwind CSS 4.

## Run it

```bash
npm install
cp .env.example .env.local   # add your IDs (optional for local dev)
npm run dev
```

Open <http://localhost:3000>.

```bash
npm run build && npm start   # production
npm run lint
```

## What's here

- Monochrome "field manual" layout: limestone paper, black ink, 1px rules,
  registration marks, and a line drawing of the Giza section.
- Archivo (UI/display) + IBM Plex Mono (technical captions), no gradients or
  glass effects.
- A single grayscale field photograph, framed like a printed plate.
- Live countdown to `NEXT_PUBLIC_LAUNCH_DATE`.
- Working waitlist form: validation, loading/success states, honeypot,
  per-IP rate limiting, duplicate detection, and join-position feedback.
- GA4 + Microsoft Clarity, env-gated and loaded without blocking the hero.
- Full SEO setup: metadata, canonical URL, Open Graph/Twitter cards, JSON-LD
  `TravelAgency` schema, `robots.txt`, `sitemap.xml`, and a logo-derived favicon.

## SEO

All search/social settings are centralized and ready to go:

| What | Where | Notes |
| --- | --- | --- |
| Title, description, keywords, canonical | `app/layout.tsx` (`metadata`) | Canonical resolves against `metadataBase`. |
| Open Graph + Twitter cards | `app/layout.tsx` | Uses `public/images/og-giza.webp` (1200×630). |
| Structured data (`TravelAgency`) | `app/page.tsx` (`structuredData`) | Includes the logo and social-card image URLs. |
| Crawler rules | `app/robots.ts` → `/robots.txt` | Allows `/`, disallows `/api/`, points to the sitemap. |
| Sitemap | `app/sitemap.ts` → `/sitemap.xml` | Single homepage entry. |
| Favicon | `app/icon.png` | Cropped monogram from the logo (Next serves `/icon.png`). |

Set the production domain **once** in `lib/site.ts` (`url`) or via
`NEXT_PUBLIC_SITE_URL` in `.env.local`. Every absolute URL above — canonical,
social card, JSON-LD, robots, sitemap — is derived from it.

## Logo & images

- `public/images/logo.png` — the supplied Egypt Origin lockup. It is used in the
  header, the JSON-LD `logo` field, and (inverted) on the social card.
- `app/icon.png` — favicon generated from a crop of the same logo.
- `public/images/og-giza.webp` — 1200×630 social card combining the inverted logo
  with the Giza photograph.
- `public/images/hero-pyramids.webp` — the field photograph shown in the page plate.

## Google Analytics + Microsoft Clarity

Both integrations are already wired up in
`components/analytics.tsx` and activate as soon as the environment variables
exist — no code changes needed.

```dotenv
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CLARITY_ID=xxxxxxxxxx
```

1. **Google Analytics 4** — create a property at
   [analytics.google.com](https://analytics.google.com), add a Web data stream,
   and copy the `G-…` Measurement ID.
2. **Microsoft Clarity** — create a project at
   [clarity.microsoft.com](https://clarity.microsoft.com) and copy the project ID
   from **Settings → Setup**.

The page sends these events automatically:

| Event | Where | Purpose |
| --- | --- | --- |
| `page_view` | GA4 | Sent on load by `gtag('config', …)` |
| `waitlist_form_start` | GA4 + Clarity | First focus in the email field |
| `generate_lead` | GA4 | Successful signup (recommended GA4 event) |
| `waitlist_signup` | Clarity | Successful signup, for funnels and filters |

> **Privacy:** Clarity records sessions. Before going live, open
> **Clarity → Settings → Sensitive data** and enable masking for email inputs
> (or use “mask all content”). No PII is sent to GA4. If you market to the
> EU/UK, gate both scripts behind a consent banner before enabling them.

Test locally by watching the browser Network tab for `googletagmanager.com` and
`clarity.ms` requests, and use GA4 **Admin → DebugView** if needed.

## Waitlist storage

Signups are appended to `data/waitlist.json` (git-ignored) by
`app/api/waitlist/route.ts`. Writes are serialized and atomic, and duplicates
return the original position.

```bash
cat data/waitlist.json          # see local signups
```

On an ephemeral/serverless host (e.g. Vercel), set `WAITLIST_WEBHOOK_URL` to a
Zapier / Make / Google Sheets / database endpoint. Every new signup is POSTed as
JSON (`event`, `email`, `source`, `campaign`, `position`, `createdAt`) and the
local file remains a best-effort cache. UTM parameters (`utm_source`,
`utm_campaign`) and `?ref=` are captured automatically.

## Customize

- **Copy & launch date:** `app/page.tsx`, `lib/site.ts`, `.env.local`.
- **Palette:** paper/ink variables at the top of `app/globals.css`.
- **Fonts:** Archivo + IBM Plex Mono in `app/layout.tsx`.
- **Domain / SEO URLs:** `siteConfig.url` in `lib/site.ts` (or `NEXT_PUBLIC_SITE_URL`).
- **Social/email links:** `siteConfig` in `lib/site.ts`.
- **Logo:** `public/images/logo.png` (header + JSON-LD); regenerate `app/icon.png`
  from it if you replace it.
- **Field photograph:** replace `public/images/hero-pyramids.webp` (keep the same name).
- **Social card:** replace `public/images/og-giza.webp` (1200×630).

## Photo credit

Hero photograph: **Spottedviper**, *Sunset at the Pyramids* —
[Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Sunset_at_the_Pyramids.jpg),
licensed [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
