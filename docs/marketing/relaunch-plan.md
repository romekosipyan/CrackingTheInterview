# Kraken Interview — Relaunch Plan (why v1 got 0 users, and the fix)

## Diagnosis: why the first launch got 0 users

1. **Wrong channel for the category.** LinkedIn is full of recruiters/hiring managers —
   the audience most hostile to interview copilots — and ad policies reject "cheating"
   tools. It was the single worst channel choice.
2. **SEO needs 3–6+ months.** One month on a months-old domain with ~zero authority
   produces essentially nothing. It wasn't a bad result; it was stopped before it started.
3. **Buying moment is search + word-of-mouth in a fear state**, not a display-ad impression.
4. **Trust/conversion leak:** unsigned Windows installer → SmartScreen "Unknown publisher"
   kills most installs at the finish line. No reviews, brand-new brand.

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

1. **Sign the Windows installer** (EV cert → kills SmartScreen). Highest-ROI single fix.
   See `docs/azure-artifact-signing.md`.
2. Add the split-screen demo video above the fold.
3. Collect 5–10 **genuine** testimonials (never fabricate — illegal + gets exposed).

## What was shipped in this repo

- `/practice` — ad-safe landing page (paid-traffic front door).
- 5 competitor "alternative" SEO pages + FAQ/Breadcrumb structured data.
- FAQ structured data on the home page.
- `/referral` — share-link generator + affiliate program (`FRIEND10`, `CREATOR10`).
- Sitemap + footer internal links updated for all new pages.
- `demo-shot-list.md` — scripted clips that drop into existing on-site video slots.

## 30-day action list (human tasks)

- Week 1: buy + configure EV code-signing cert; re-release signed installer.
- Week 1: record Clip 1 (split-screen). Post to X, Shorts, TikTok, r/cscareerquestions.
- Week 1: run `cd server && npx tsx scripts/create-promo-codes.ts` (live key) so
  `FRIEND10`/`CREATOR10` resolve at checkout; submit sitemap to Google Search Console.
- Week 2: record Clips 2–3; publish 2 Reddit value posts; point a small Reddit-ads
  test at `/practice`.
- Week 3: outreach to 10 CS-career micro-influencers with `CREATOR10` + free lifetime.
- Week 4: Product Hunt launch once you have a demo video + a few testimonials.
