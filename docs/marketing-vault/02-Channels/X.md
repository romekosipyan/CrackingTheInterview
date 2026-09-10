---
type: channel
channel: x
status: active
front_door: organic
utm_source: twitter
utm_medium: post | thread
promo: TWITTER10
account: https://twitter.com/krakeninterview
kpi: link clicks to /, trial starts with utm_source=twitter
cadence: 1-2 posts per day, 1 thread per week
owner: human (posting) / agent:social-drafter (drafts)
---

# X (Twitter)

## Why this channel
Tech-career X is where demo clips travel. A 12-second split-screen clip with the caption "left: your screen, right: what the interviewer records" is inherently shareable in this niche. X also feeds Hacker News and Reddit indirectly (people screenshot and repost).

## Content mix (weekly)
| Type | Count | Example |
|------|-------|---------|
| Demo clip (native video) | 2 | Clip 1, Clip 2, Clip 3 from [[Demo-Shot-List]]; reuse with new captions |
| Tips thread | 1 | "5 reasons engineers fail system design (and the fix)" — value first, product in the last tweet |
| Comparison / price hook | 1 | "Interview copilot pricing in 2026: $39 / $29 / $24 — same stealth, plus diagrams" (dated, verified) |
| Poll or question | 1 | "Hardest round? coding / design / behavioral / take-home" — reply with tips |
| Build-in-public note | 1 | what shipped this week, a real number from the scorecard (never inflated) |
| Reply-guy helpfulness | daily | reply to "system design interview tomorrow, tips?" style posts found by [[Community-Scout]] |

## Rules
- Native video always beats links. Put the link in the first reply or bio, not the post.
- Hook in the first line; assume muted autoplay; burned-in captions on clips.
- No hashtags beyond one (#systemdesign at most). No engagement bait.
- Numbers we post must exist in `07-Metrics/`.
- Front door `/`; `TWITTER10` in the reply with the link.

## Link format
`https://krakeninterview.com/?utm_source=twitter&utm_medium=post&utm_campaign=<campaign>` and for pricing `https://krakeninterview.com/pricing?promo=TWITTER10&utm_source=twitter&utm_medium=post&utm_campaign=<campaign>`.

## What the agent produces
[[Social-Drafter]] writes 2 posts/day into `05-Content/Queue/` with `channel: x`, one of which is clip-ready (caption + which clip) once clips exist. It never repeats an `angle` used in `Queue/`, `Approved/`, or `Published/` in the last 21 days.

## Measurement
Link clicks (X analytics, manual), `utm_source=twitter`, `TWITTER10`. Record impressions/clicks in the `Published/` note.
