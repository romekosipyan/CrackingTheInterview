---
type: task
id: T-042
status: todo
owner: human
channel: measurement
priority: P3
due: 2026-11-02
recurrence: none
depends_on: [T-006]
campaign:
created: 2026-09-10
---

# T-042 Script GSC export into vault format

## Why it matters
Removes the manual Monday paste once GSC has data.

## Definition of done
- [ ] Small script (Node) using the Search Console API with a service account
- [ ] Writes a table into the current 07-Metrics week note
- [ ] Runs from the Metrics-Scorecard automation or locally

## Depends on
[[T-006 Submit sitemap to GSC and Bing]]

## Notes / log
- 2026-09-10: created by orchestrator