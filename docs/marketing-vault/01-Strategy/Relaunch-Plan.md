---
type: strategy
topic: post-mortem
migrated_from: docs/marketing/relaunch-plan.md
updated: 2026-09-10
---

# Kraken Interview — Relaunch Plan (why v1 got 0 users, and the fix)

> Migrated into the vault unchanged on 2026-09-10. The current plan lives in [[Roadmap-90-Day]], [[Positioning]], and [[00-Home]]; this note is the diagnosis they build on. Referenced files: [[Demo-Shot-List]], [[Social-Posts-Week1]].

## Diagnosis: why the first launch got 0 users

1. **Wrong channel for the category.** LinkedIn is full of recruiters/hiring managers —
   the audience most hostile to interview copilots — and ad policies reject "cheating"
   tools. It was the single worst channel choice.
2. **SEO needs 3–6+ months.** One month on a months-old domain with ~zero authority
   produces essentially nothing. It wasn't a bad result; it was stopped before it started.
3. **Buying moment is search + word-of-mouth in a fear state**, not a display-ad impression.
4. **Trust deficit (not signing):** the installers ARE code-signed — Windows via Azure
   Artifact Signing (Public Trust, validated legal entity) and macOS signed + notarized
   with an Apple Developer cert. The real trust gap is **no reviews, no demo proof, and a
   brand-new brand** — nobody has a reason to believe it works yet. (Note: a new
   non-EV Windows cert can still trip SmartScreen *reputation* warnings until download
   volume accrues, but that resolves with usage — it is not the blocker.)

## Positioning fix: dual front doors

- **Ad-safe:** `/practice` — "interview *practice* copilot" (prep, structure, non-native
  speakers, confidence). Use this for all paid traffic (Google/Reddit/YouTube). No
  "invisible/stealth" language.
- **Community/viral:** `/` — the stealth angle stays for Reddit, X, YouTube demos where
  taboo drives sharing.

## Channels that actually work for this category (priority)

1. **Demo-clip virality** (Shorts/TikTok/X/Reels) — see `demo-shot-list.md`. #1 asset.
2. **Reddit/X with maker disclosure** — see `social-posts-week1.md`.
3. **High-intent SEO** — competitor "alternative" pages (built: `/interview-coder-alternative`,
   `/shadecoder-alternative`, `/lockedin-ai-alternative`, `/final-round-ai-alternative`,
   `/cluely-alternative`).
4. Micro-influencers + affiliates (`/referral`, promo `CREATOR10`).
5. Product Hunt / Show HN once a demo video + testimonials exist.
6. Paid — only after CAC validated, and only Reddit/YouTube/Google Search (never LinkedIn).

## Conversion fixes (do before spending on traffic)

Installers are already signed (Windows: Azure Artifact Signing / Public Trust; macOS:
Apple Developer cert + notarized), so trust at the download step is handled. The
remaining levers are proof and friction:

1. **Add the split-screen demo video above the fold** — proof beats copy for this product.
2. **Collect 5–10 genuine testimonials** (never fabricate — illegal + gets exposed).
3. Keep the trial's "verify it's invisible in 30 seconds" test front and center.

## What was shipped in this repo

- `/practice` — ad-safe landing page (paid-traffic front door).
- 5 competitor "alternative" SEO pages + FAQ/Breadcrumb structured data.
- FAQ structured data on the home page.
- `/referral` — share-link generator + affiliate program (`FRIEND10`, `CREATOR10`).
- Sitemap + footer internal links updated for all new pages.
- `demo-shot-list.md` — scripted clips that drop into existing on-site video slots.

## 30-day action list (human tasks)

- Week 1: record Clip 1 (split-screen). Post to X, Shorts, TikTok, r/cscareerquestions.
- Week 1: run `cd server && npx tsx scripts/create-promo-codes.ts` (live key) so
  `FRIEND10`/`CREATOR10` resolve at checkout; submit sitemap to Google Search Console.
- Week 2: record Clips 2–3; publish 2 Reddit value posts; point a small Reddit-ads
  test at `/practice`.
- Week 3: outreach to 10 CS-career micro-influencers with `CREATOR10` + free lifetime.
- Week 4: Product Hunt launch once you have a demo video + a few testimonials.
