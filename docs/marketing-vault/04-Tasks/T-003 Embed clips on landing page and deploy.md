---
type: task
id: T-003
status: todo
owner: human
channel: site
priority: P0
due: 2026-09-15
recurrence: none
depends_on: [T-001]
campaign: "[[Demo-Clip-Launch]]"
created: 2026-09-10
---

# T-003 Embed clips on landing page and deploy

## Why it matters
The landing page already has video slots (website/src/content/landing.ts). Filling them is a one-commit conversion fix.

## Definition of done
- [ ] Files in website/public/videos/: you-screensharing.mp4, interviewer-view.mp4, system-design.mp4
- [ ] Each < 5 MB, H.264, loops cleanly
- [ ] Deployed and verified on krakeninterview.com

## Depends on
[[T-001 Record demo Clip 1 split-screen]]

## Notes / log
- 2026-09-10: created by orchestrator