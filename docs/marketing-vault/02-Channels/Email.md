---
type: channel
channel: email
status: future (Phase 3)
front_door: n/a
utm_source: email
utm_medium: drip
promo: LAUNCH10
kpi: trial to paid conversion lift
cadence: 3-message drip after trial start
owner: human (product work required)
---

# Email (future — requires product work)

## Why it is not live
There is no signup. Trials are keyed by machine ID; the only email we ever see is at Stripe checkout. That is a deliberate friction-reduction choice and it works against retention: a trial user who closes the app is gone.

## Minimal spec (Phase 3, week 9-10)
1. **Optional email on trial start** in the desktop app: "Want the 3-part prep guide + a reminder before your trial expires? (optional)". Store in KV `DEVICES` record as `email`, never in the vault.
2. **Provider:** Resend (free tier: 3k emails/month) or Loops. Cloudflare Function `functions/api/email/subscribe.ts` writes to provider; `functions/api/email/unsubscribe.ts`.
3. **Drip (3 messages):**
   - T+0: "Your 30 minutes: the 3 things to try" (Alt+S capture, Alt+Shift+Enter deep answer with a diagram, JD paste). Link to Clip 2.
   - T+2d: "Structure under pressure — the 4-phase framework" (blog post) + `LAUNCH10`.
   - T+5d: "Your loop, priced honestly" — weekly vs monthly, cancel any time, the comparison table.
4. **Post-purchase (Stripe customer email, already available):** welcome + Discord invite + "reply with your interview date and we'll send a checklist". Ask for a testimonial after 14 days.

## Compliance
Explicit opt-in, one-click unsubscribe, no purchased lists, no cold email to scraped addresses ([[Compliance-and-Ethics]]).

## Tasks
- [[T-030 Spec optional email capture on trial start]]
- [[T-031 Choose email provider and wire subscribe endpoint]]
- [[T-032 Write 3-message trial drip]]
