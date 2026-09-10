---
type: task
id: T-031
status: todo
owner: human
channel: email
priority: P3
due: 2026-11-16
recurrence: none
depends_on: [T-030]
campaign:
created: 2026-09-10
---

# T-031 Choose email provider and wire subscribe endpoint

## Why it matters
Resend or Loops free tier is enough for the first thousand trials.

## Definition of done
- [ ] functions/api/email/subscribe.ts and unsubscribe.ts
- [ ] Provider API key as Cloudflare secret
- [ ] Double opt-in or clear single opt-in with unsubscribe link

## Depends on
[[T-030 Spec optional email capture on trial start]]

## Notes / log
- 2026-09-10: created by orchestrator