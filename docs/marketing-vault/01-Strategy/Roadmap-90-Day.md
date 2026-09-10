---
type: strategy
topic: roadmap
updated: 2026-09-10
starts: 2026-09-14
ends: 2026-12-06
owner: agent:orchestrator
---

# 90-day roadmap

Three phases. Each phase has one job. The [[Orchestrator]] may reorder tasks inside a phase but should not skip a phase's exit criteria.

## Phase 1 — Proof (weeks 1-4, 2026-09-14 → 2026-10-11)
**Job:** make the product believable and measurable. Get the first 20 trial starts and the first 3 payments.

| Week | Focus | Exit signal |
|------|-------|-------------|
| 1 | Measurement live (`EVENTS` KV, `EVENTS_READ_TOKEN`, GSC). Record Clip 1. Live promo codes. Automations running. | Scorecard shows non-zero page views by source |
| 2 | Clip 1 native on X, Shorts, TikTok, Reddit (value post, disclosed). Clip 1 embedded above the fold on `/`. | 20+ trial starts |
| 3 | Clips 2-3 (system design diagram, JD tailoring). Blog cadence 2/week hitting fear queries. Community Scout replies daily. | First 3 purchases; first testimonial asks sent |
| 4 | Show HN ("Show HN: I built an interview copilot that stays off screen share") — only if Clip 1 is done. 5 testimonials. | HN thread live; 5 real quotes in the vault |

Campaigns: [[Demo-Clip-Launch]], [[Alternative-Pages-SEO]] (maintenance).

## Phase 2 — Distribution (weeks 5-8, 2026-10-12 → 2026-11-08)
**Job:** put the proof in front of every persona where they already are.

- [[Product-Hunt-Launch]] on a Tuesday in week 5 or 6 with Clip 1, testimonials, `PHUNT10`.
- [[Referral-Creators]]: outreach to 20 CS-career micro-creators (10k-200k) from [[Communities]] with `CREATOR10`, free lifetime, and the clip. Target 5 sponsorless mentions.
- Reddit: 2 value posts/week across the allowed subs in [[Subreddit-Rules]]; comment-only in hostile subs.
- Blog: 2 posts/week, add "alternative" pages for any new competitor the [[Competitor-Watch]] finds.
- Directory submissions (AlternativeTo, There's An AI For That, SaaSHub, Futurepedia) — one-time, `/practice` where policies are strict.
- Discord: weekly Friday mock round becomes real; recording (with consent) → Shorts.

Exit: 300 trial starts/week, 20 purchases/week, top source identified.

## Phase 3 — Compounding (weeks 9-12, 2026-11-09 → 2026-12-06)
**Job:** make the channels that worked work without you.

- Double down on the single best source from the scorecard; cut the bottom half of channels.
- Email capture after trial (product work: optional email on trial start, then a 3-message drip). Spec in [[Email]].
- Case study page from the first paying cohort (anonymized, with consent).
- Evaluate a small paid test (Reddit ads → `/practice`) only if trial-to-paid ≥ 7% and CAC math works; still zero budget until then.
- Seasonal push: December/January hiring freeze ends → "new year loop" content pre-written in December.

Exit: 600 trial starts/week, $12k MRR trajectory, one channel that grows with zero human posting (SEO).

## Standing weekly cadence (all phases)
| Day | What | Who |
|-----|------|-----|
| Mon | Scorecard, blog post 1 | [[Metrics-Scorecard]], [[SEO-Blog-Writer]] |
| Tue-Sat | Social drafts + community digest | [[Social-Drafter]], [[Community-Scout]] |
| Thu | Blog post 2 | [[SEO-Blog-Writer]] |
| Fri | Competitor diff, Discord mock round | [[Competitor-Watch]], human |
| Sun | Weekly review and re-plan | [[Orchestrator]] |
| Daily | Approve queue, post, log results | human (15-30 min) |

## Risks and what we do about them
| Risk | Mitigation |
|------|-----------|
| Platform hostility to "cheating" tools | Dual front doors ([[Positioning]]); disclosure; `/practice` for any policy-sensitive surface |
| Account bans on Reddit | [[Subreddit-Rules]], 9:1 ratio, one account, no vote asks |
| Windows SmartScreen reputation warning | Signed already; download volume fixes it; add a "Windows protected your PC?" note in the download FAQ |
| Clip never gets recorded | It is the first "Needs your decision" item on [[00-Home]] every week until done |
| Agents drift into spam | Compliance checklist in every content note; Orchestrator audits weekly |
