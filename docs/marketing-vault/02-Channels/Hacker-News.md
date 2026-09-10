---
type: channel
channel: hn
status: planned
front_door: organic
utm_source: hackernews
utm_medium: show-hn | comment
promo: LAUNCH10
kpi: trial starts on Show HN day + 3, quality of feedback
cadence: one Show HN (week 4), comment-only otherwise
owner: human
---

# Hacker News

## Why
HN is the Loop Engineer persona's home. It is also the most honesty-sensitive audience on the internet: a Show HN that explains exactly how capture exclusion works, what the tool does not do, and why it is priced as it is can do well; anything that smells of "cheating tool" marketing will be flagged. The [[Relaunch-Plan]] correctly deferred this until there is a demo and traction; we do it in week 4 of [[Roadmap-90-Day]] if Clip 1 exists.

## Show HN draft (edit, do not post verbatim)
**Title:** Show HN: Kraken Interview – an interview copilot that stays out of screen-share capture

**Text:**
> I built a desktop overlay for live technical interviews. It listens/captures on hotkey, streams a structured answer (coding hints, a Mermaid system-design diagram, or a STAR outline), and uses OS capture exclusion (`WDA_EXCLUDEFROMCAPTURE` on Windows, `NSWindowSharingNone` on macOS) so the overlay is not in the shared-screen pipeline.
>
> Why: I bombed a system design round after months of LeetCode. The gap was structure under pressure, not knowledge.
>
> What it does not do: it will not pass an interview for you, it is not tested against proctoring software, and it is visible to anyone physically looking at your monitor.
>
> Electron + React, Cloudflare Pages/Functions, Stripe. 30-minute free trial per device, no account. Happy to answer questions about the capture-exclusion approach and the tradeoffs.

## Rules
- Post 14:00-16:00 UTC Tue-Thu.
- Answer every technical question; concede every fair criticism; never argue about ethics — state the "structure and recall" framing once and move on.
- Never ask anyone to upvote. Do not post the HN link on X until the thread has organic traction.
- Comments in other threads ("Ask HN: how do you prep for system design?") are welcome: value first, disclosure, no link unless asked.

## What the agent produces
[[Community-Scout]] flags relevant Ask HN threads with suggested (disclosed) replies.

## Measurement
`utm_source=hackernews` (links from HN strip nothing, but users often retype the domain — expect `direct` spike), trial starts day 0-3.
