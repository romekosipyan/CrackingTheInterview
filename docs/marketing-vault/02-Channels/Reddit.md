---
type: channel
channel: reddit
status: active
front_door: organic
utm_source: reddit
utm_medium: post | comment
promo: REDDIT10
kpi: trial starts with utm_source=reddit or ref-reddit.com
cadence: 2 value posts per week, daily helpful comments
owner: human (posting) / agent:social-drafter (drafts) / agent:community-scout (threads to join)
---

# Reddit

## Why this channel
Reddit is where all three personas ask for help in a fear state and where "interview coder alternative"-type threads already exist. It is also the harshest audience for self-promotion, so the rules below are strict. Handled well it is the best zero-budget trial driver we have; handled badly it burns the account and the brand.

## The 9:1 rule and one account
- For every post or comment that mentions Kraken, nine that do not. The [[Community-Scout]] supplies the threads; most replies should be pure help.
- One account (the maker's). No alts. Karma and history matter; a fresh account with links gets auto-removed.
- Disclosure line in every mention: "Disclosure: I'm the maker of Kraken Interview." ([[Compliance-and-Ethics]])

## Subreddit tiers (details in [[Subreddit-Rules]])
- **Value posts allowed (with disclosure):** r/cscareerquestions (careful), r/leetcode, r/interviews, r/csMajors, r/cscareerquestionsEU, r/developersIndia, r/SideProject (maker post).
- **Comment only, no links:** r/ExperiencedDevs, r/learnprogramming, r/jobs, r/webdev.
- **Avoid:** r/recruitinghell (hostile), anything where mods have removed copilot threads before.

## Post formats that work here
1. **Framework post** — "A 4-phase framework that stopped me freezing in system design" (exists in [[Social-Posts-Week1]]). Long, specific, one disclosed mention at the end.
2. **Honest comparison** — "Compared 3 AI interview copilots — pricing, features, screen-share behavior" with a table, dated prices, disclosure up top.
3. **Failure story + what changed** — the New Grad hook: "300 LeetCode problems and still bombed the Google loop".
4. **Show-and-tell in r/SideProject** — the split-screen clip, the tech (capture exclusion), what was hard to build.
5. **Comment replies** — 3-8 sentences answering the actual question; mention Kraken only if the question is about tools or structure under pressure.

## Timing
Post 13:00-16:00 UTC Tue-Thu (US morning). Never repost the same body within 30 days. Cross-posting the same text to 2+ subs on the same day looks like spam.

## What the agents produce
- [[Social-Drafter]] → one post note per day in `05-Content/Queue/` with `channel: reddit`, subreddit named, disclosure included, link only if allowed for that sub.
- [[Community-Scout]] → `06-Research/Community-Watch/YYYY-MM-DD.md` with 5-15 live threads (URL, sub, what they asked, suggested reply, whether a mention is appropriate).

## Measurement
`utm_source=reddit` where links allowed; `ref-reddit.com` fallback; `REDDIT10` at checkout. Track post-level results in the `Published/` note.

## Stop rule
If a post is removed by mods, do not repost. Log it in the daily log; the Orchestrator adjusts the sub's tier in [[Subreddit-Rules]].
