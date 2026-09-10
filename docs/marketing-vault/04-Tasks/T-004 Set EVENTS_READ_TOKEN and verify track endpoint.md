---
type: task
id: T-004
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

# T-004 Set EVENTS_READ_TOKEN and verify track endpoint

## Why it matters
Without this the Metrics-Scorecard agent is blind and every channel decision is a guess.

## Definition of done
- [ ] Generate a 32+ char random token; set as encrypted var EVENTS_READ_TOKEN in Cloudflare Pages
- [ ] Deploy master; curl -H "Authorization: Bearer <token>" https://krakeninterview.com/api/track/summary?days=1 returns JSON
- [ ] Load / once and confirm page_view appears in the summary

## Depends on
none

## Notes / log
- 2026-09-10: created by orchestrator