---
type: channel
channel: seo
status: active
front_door: organic
utm_source: google
promo: LAUNCH10
kpi: organic sessions to /pricing, fear-query impressions in GSC
cadence: 2 posts per week (Mon, Thu)
owner: agent:seo-blog-writer
---

# SEO / Blog

## Why this channel
The buying moment is a fear-state search. SEO is the only channel that compounds without daily posting, and the domain already has 8 posts and 5 competitor "alternative" pages with structured data. One month was not enough to judge it; 3-6 months is. We keep the cadence steady and measure impressions before clicks.

## What already exists
- Posts in `website/src/content/blog.ts` (schema: `slug, title, excerpt, body, author, date, readingTime, tags`), rendered at `/blog/:slug`.
- Alternative pages from `website/src/content/alternatives.ts`: `/interview-coder-alternative`, `/shadecoder-alternative`, `/lockedin-ai-alternative`, `/final-round-ai-alternative`, `/cluely-alternative`.
- `website/public/sitemap.xml`, `robots.txt`, `SeoHead.tsx` (OG/Twitter/JSON-LD), FAQ structured data on `/` and `/practice`.

## Content strategy
Three buckets, rotated in this order by the [[SEO-Blog-Writer]] from [[Keyword-Backlog]]:
1. **Fear queries** ("failed system design interview what now", "freezing in coding interviews") — the reader is in pain now. Post gives a genuinely useful 5-step recovery/prep plan, then one honest paragraph on how a copilot helps with the "structure under pressure" part, CTA to `/` or `/practice`.
2. **Compare queries** ("interview coder vs cluely", "is final round ai worth it") — table-first, dated prices, links to the relevant alternative page, CTA to `/pricing`.
3. **How-to queries** (frameworks, STAR examples, live coding etiquette) — long-form, actually good, one contextual mention, CTA to blog-to-trial.

Rules:
- 1,200-1,800 words, H2/H3 structure, one table where natural, 2-3 internal links (an alternative page, `/pricing` or `/practice`, one older post), one external authoritative link.
- Title ≤ 60 chars where possible; excerpt 140-160 chars; `readingTime` computed from word count / 220.
- Every new post is added to `sitemap.xml` with today's `lastmod`.
- No keyword stuffing; write for the engineer reading it at 11pm.
- Never fabricate statistics; cite or omit.

## Distribution of each post
- [[Social-Drafter]] turns each new post into 1 X thread and 1 Reddit-safe summary (comment-ready, disclosed) within 48 hours.
- Add to Discord `#resources`.

## Measurement
- Google Search Console impressions/clicks by query (human exports weekly until an API path exists; task [[T-006 Submit sitemap to GSC and Bing]]).
- `/api/track` `page_view` with `utm_source=google` is unreliable (no UTM on organic); use referrer fallback `ref-google.com` and GSC.

## Backlog and status
See [[Keyword-Backlog]] (`status` column: todo → drafted → published, with slug).

## Anti-patterns
- Writing "best AI interview tools 2026" listicles that rank us #1 — engineers see through it; write honest comparisons instead.
- Publishing without updating the sitemap.
- Touching existing posts' slugs (breaks indexed URLs).
