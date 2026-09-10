---
type: channel
channel: shorts
status: blocked-until-clip
front_door: ad-safe (/practice in description)
utm_source: youtube | tiktok | instagram
utm_medium: short
promo: LAUNCH10
kpi: views, profile clicks, trial starts with utm_source=youtube/tiktok
cadence: 3 shorts per week once clips exist
owner: human (recording, posting) / agent:social-drafter (scripts, captions)
---

# YouTube Shorts / TikTok / Reels

## Why this channel
This is the viral engine for the New Grad persona and the proof engine for everyone else. "What you see vs what they see" is a native short-form format: the reveal is visual, needs no voice, and provokes comments ("is this legal?", "does it work on Teams?") that the algorithm rewards. Every clip is also the on-site demo (see [[Demo-Shot-List]] for file names in `website/public/videos/`).

## Blocked on
[[T-001 Record demo Clip 1 split-screen]]. Until Clip 1 exists this channel has nothing to post. The Orchestrator keeps this at the top of "Needs your decision" on [[00-Home]].

## Clip library (from [[Demo-Shot-List]])
| Clip | Hook (first 1.5s) | Caption | Length |
|------|-------------------|---------|--------|
| 1 Split-screen | Start on the reveal: overlay on left, nothing on right | "Left: your screen. Right: what the interviewer records." | 8-15s |
| 2 System design in 10s | Mermaid diagram animating | "Other copilots give you a wall of text. This one draws the architecture." | 10-13s |
| 3 JD tailoring | Answer referencing the JD stack | "Answers that match the actual role." | 12s |
| 4 Price motion graphic | "$90 / $69.99 / $69 / $54" | "Stop overpaying for an interview copilot." | 8s |

## Posting rules
- Post natively on each platform (no cross-posted watermarks). 9:16, burned-in captions, end card "Kraken Interview — free 30-min trial — krakeninterview.com/practice".
- Titles/descriptions use ad-safe language: "interview practice copilot", "stay structured under pressure". Do not use "cheat", "undetectable", "get away with". The clip content itself can show the overlay.
- Link in bio → `/practice?utm_source=tiktok&utm_medium=bio` (or youtube/instagram).
- Reply to every comment in the first 2 hours; answer "does it work on X" honestly.
- Repost each clip with a new caption every 2-3 weeks; short-form is not one-and-done.

## What the agent produces
[[Social-Drafter]] writes caption variants and 3 new 15-second script ideas per week into `05-Content/Queue/` with `channel: shorts`, `format: script`, tied to persona hooks in [[ICP-Personas]].

## Measurement
Platform analytics (manual weekly), `utm_source=youtube/tiktok/instagram`.
