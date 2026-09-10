---
type: channel
channel: producthunt
status: planned
front_door: organic (/launch)
utm_source: producthunt
utm_medium: launch
promo: PHUNT10
kpi: upvotes, comments, trial starts on launch day + 7
cadence: one launch (Phase 2), then "launch again" for major versions
owner: human
---

# Product Hunt

## Why and when
PH brings a one-day spike of exactly the wrong audience (makers, not job seekers) — but it also produces a permanent backlink, a badge, a place to send press, and a burst of screenshots that travel to X and LinkedIn. It is worth doing once, **after** the proof exists (Clip 1 + 5 testimonials), not before. Campaign: [[Product-Hunt-Launch]].

## Prerequisites
- [ ] Clip 1 recorded and on the site
- [ ] 5 real testimonials ([[T-013 Collect first 5 real testimonials]])
- [ ] `PHUNT10` live in Stripe ([[T-005 Create live Stripe promotion codes]])
- [ ] `website/src/pages/LaunchPage.tsx` placeholder URL replaced with the real listing ([[T-020 Wire Product Hunt URL into LaunchPage]])
- [ ] Maker comment drafted (starting point in [[Social-Posts-Week1]])
- [ ] 10 supporters warned 24h before (Discord + X) — "check us out", never "upvote us"

## Listing
- Tagline (≤ 60): "AI interview copilot for coding, system design and behavioral rounds"
- First comment: the story (bombed a design round despite months of LeetCode), what it does, how capture exclusion works, the free trial, the question to the community ("which round do you struggle with most?").
- Gallery: Clip 1 as video, 4 screenshots (overlay quick answer, Mermaid diagram, JD context, pricing).
- Topics: Developer Tools, Artificial Intelligence, Career, Productivity.

## Launch day (Tuesday, 12:01 AM PT)
- Respond to every comment within 30 minutes for 12 hours.
- Post the PH link on X and Discord at 07:00 PT and 12:00 PT, not more.
- Do not buy upvotes, do not run "upvote for lifetime" promotions.

## Measurement
`utm_source=producthunt`, `PHUNT10`, trial starts on launch day and the following week vs baseline.
