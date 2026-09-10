---
type: channel
channel: creators
status: planned
front_door: ad-safe (/practice)
utm_source: creator-<handle>
utm_medium: video | newsletter
promo: CREATOR10 (audience), FRIEND10 (referral page)
kpi: creator mentions live, trial starts with utm_source=creator-*
cadence: Phase 2 — 20 outreach messages, target 5 mentions
owner: human (outreach) / agent:community-scout (list building)
---

# Micro-influencers and affiliates

## Why
Zero budget means no sponsorships — but CS-career creators with 10k-200k followers constantly need content, and a "what you see vs what they see" clip is content. The offer is: free Lifetime plan, a `CREATOR10` code for their audience, a tracked link, and a real affiliate cut later when we have Stripe promotion-code attribution working ([[T-005 Create live Stripe promotion codes]]).

## Existing assets
- `/referral` page (`website/src/pages/ReferralPage.tsx`) — share-link generator, `FRIEND10`, `partners@krakeninterview.com`.
- Promo codes `CREATOR10`, `FRIEND10` in `shared/promoCodes.ts` (need live Stripe promotion codes).

## Target list
Built and maintained in [[Communities]] (section c: YouTube/TikTok creators; section d: newsletters). Prioritize: bootcamp-grad and new-grad focused, posts about interview prep in the last 30 days, has done tool reviews before.

## Outreach message (one per creator, public contact channel, personalize the first line)
> Hi <name> — I watched your <specific video> and the part about <specific point> is exactly the problem I built Kraken Interview for: a desktop copilot for coding/system design/behavioral rounds that stays out of screen-share capture. I'm not asking for a sponsored post. I'd like to give you a Lifetime plan, a 10% code for your audience (CREATOR10), and a tracked link so you can see if it's useful to them. If you ever want to review it honestly — including what it doesn't do — I'll send the split-screen demo and answer any technical questions. — Roman, maker

## Rules
- Creators link to `/practice` (protects their channel). Their audience can find `/` on their own.
- No scripts to creators. Honest review or nothing.
- One message; one follow-up after 10 days; then stop.
- Log every outreach in `Published/` as a content note with `channel: creators`, `status` = sent / replied / live.

## Affiliate program (Phase 3)
When Stripe promotion codes are live, offer 20% of first payment per code redemption, paid monthly via PayPal/Stripe Connect. Terms page to be written under `/referral`. Until then, the value is the free plan and the code.

## Measurement
`utm_source=creator-<handle>`, `CREATOR10` redemptions (Stripe), trial starts week of mention.
