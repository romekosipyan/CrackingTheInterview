---
type: task
id: T-005
status: todo
owner: human
channel: measurement
priority: P0
due: 2026-09-12
recurrence: none
depends_on: []
campaign:
created: 2026-09-10
---

# T-005 Create live Stripe promotion codes

## Why it matters
REDDIT10 / TWITTER10 / PHUNT10 / DISCORD10 / FRIEND10 / CREATOR10 only auto-apply via coupon today; manual entry at checkout fails until promotion codes exist. They are also our attribution.

## Definition of done
- [ ] cd server && STRIPE_SECRET_KEY=sk_live_... npx tsx scripts/create-promo-codes.ts
- [ ] Test each code in Stripe Checkout (test mode first, then live)
- [ ] Record which codes are live in 08-Agents/Conventions.md

## Depends on
none

## Notes / log
- 2026-09-10: created by orchestrator