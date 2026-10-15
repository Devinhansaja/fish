# Aquazone - Ornamental Fish Export Website

Next.js (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion.
A B2B export-inquiry website for **Aquazone Ornamental Fish Farm (Pvt) Ltd**, Nelawa, Kohilagethera, Sri Lanka.

## Run it

Requires Node.js 20+ (built with Node 24).

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

Copy `.env.example` to `.env.local` and fill in what you have.

## What is where

| Path | Purpose |
|---|---|
| `app/` | Pages: `/`, `/about`, `/fish-collection`, `/fish-collection/[slug]`, `/export-services`, `/sustainability`, `/quality-assurance`, `/gallery`, `/news`, `/news/[slug]`, `/faq`, `/contact`; `sitemap.ts`, `robots.ts`, API routes |
| `app/api/inquiry` | Server-validated inquiry endpoint (honeypot, fill-time check, rate limit, optional Turnstile) |
| `app/api/newsletter` | Newsletter sign-up endpoint |
| `lib/site.ts` | Company details, navigation, **statistics, export destinations, testimonials (all placeholders)** |
| `lib/species.ts` | Fish catalog data model + draft species |
| `lib/content.ts` | Gallery, services, FAQ, blog posts (CMS-ready collections) |
| `lib/motion.ts` | Central animation config (easings, durations, particle limits) |
| `components/` | Reusable components (Hero, BubbleField, FishSwarm, WaveDivider, FishCarousel, WorldExportMap, ExportTimeline, FishGrid, GalleryGrid, FAQAccordion, InquiryForm, ...) |
| `public/images/` | Real Aquazone photographs (29) |

Design tokens (Ocean Navy `#0B2545`, Tropical Aqua `#00B4C6`, Coral `#FF7B63`, Sunshine `#FFD166`, Soft Mint `#EEFFFC`) live in `app/globals.css`.
Coral is used **only** for primary conversion actions.

## Inquiry form delivery (required before launch)

The form never pretends to succeed. Configure one or both:

* `RESEND_API_KEY` + `INQUIRY_TO_EMAIL` (+ `INQUIRY_FROM_EMAIL`) - email notification
* `CRM_WEBHOOK_URL` - JSON POST to your CRM / Zapier / Make

With nothing configured: **development** logs the inquiry to the server console and says so in the confirmation message;
**production** returns HTTP 503 and the form shows a "temporarily unavailable" message.
For multi-instance deployments replace the in-memory rate limiter in `lib/deliver.ts` with Redis/Upstash.

## Content that MUST be confirmed before publishing

Nothing below was invented; placeholders are labelled "TBC / Draft / Pending" on the page.

- Phone, email, WhatsApp number, Google Maps embed, social links, company-profile PDF (`.env`)
- Government registration number / certifications / licences (shown as "pending verification")
- Statistics: species count, destination countries, outgrower families, live-arrival % (`lib/site.ts` `stats` - counters animate only once a number is set)
- Export destinations (the world map shows placeholder regions; edit `destinations` in `lib/site.ts`)
- Testimonials (placeholders; replace with genuine, permission-cleared quotes)
- Species: availability, sizes, water parameters (general reference ranges, flagged `careVerified: false`), native-species export legality (`exportCheckRequired`), the "Zebra Loach" scientific name
- FAQ policies marked "Policy to confirm" (MOQ, payment, documents, shipping terms, response time)
- Company history dates, management profiles, blog posts (educational drafts, no invented news)
- Photos for tropical species (currently labelled "photo coming soon") plus quarantine and exhibition photography
- Logo: `components/Logo.tsx` is a placeholder mark

## Swimming fish videos

Five supplied fish animations (blue tang, angelfish, stingray, clownfish, cartoon orange fish) swim across the hero and,
smaller, across every page (`components/Underwater.tsx` `FishSwarm`, `components/GlobalEffects.tsx` `AmbientFish`).

* The source MP4s had a checkerboard baked into the pixels, so the background was keyed out frame by frame and exported as
  transparent VP9 WebM + a still WebP in `public/media/`. Registry: `lib/swimfish.ts`; player: `components/SwimFish.tsx`.
* Safari and iOS cannot play WebM with alpha, so they show the still WebP (the fish still glides across the page).
* Sizes are set in the `swimmers` array (hero) and `lanes` array (all pages). Reduced motion hides them.

## Motion & accessibility

* Honors `prefers-reduced-motion` and has a **Reduce motion** toggle in the footer (disables parallax, fish, bubbles, cursor, page wipes).
* Decorative animation pauses when off-screen or the tab is hidden; mobile caps bubbles (12) and fish (2).
* Skip link, visible focus, accessible accordion/carousel/lightbox, WCAG AA contrast (coral buttons use navy text).

## Tech notes

* GSAP and Lenis are intentionally **not** used - Framer Motion + CSS cover every effect and keep the bundle lighter.
* Fonts (Poppins, Inter) load via `next/font/google` and need internet access at build time.
* `AGENTS.md` / `node_modules/next/dist/docs` contain version-specific Next.js notes.

## Deploying

Any Node host (Vercel, Netlify, a VPS). Set the environment variables, run `npm run build`, then `npm start`.
Set `NEXT_PUBLIC_SITE_URL` to the final domain so sitemap, canonical URLs and structured data are correct.
