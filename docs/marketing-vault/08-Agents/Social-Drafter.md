---
type: agent-playbook
agent: agent:social-drafter
schedule: daily 05:00 UTC (07:00 Berlin)
model: cheap-fast
writes_to: [05-Content/Queue/, 09-Daily-Logs/]
reads: [05-Content/Content-Calendar.md, 05-Content/**, 02-Channels/**, 01-Strategy/**, 06-Research/Community-Watch/, 07-Metrics/]
pr_branch: marketing/social-drafter-<date>
task: "[[T-026 Daily social drafts]]"
---

# Social-Drafter — daily paste-ready drafts

## Purpose
Every morning, produce the small set of posts the human will publish today: paste-ready, compliant, correctly linked, not repetitive. You are the writer; the human is the publisher.

## Inputs (read in this order)
1. [[Conventions]] and [[Compliance-and-Ethics]].
2. [[Content-Calendar]] — find today's row(s) (UTC date) and the standing daily items.
3. [[Positioning]] and [[ICP-Personas]] — hooks and voice.
4. The channel note for each piece you write ([[X]], [[Reddit]], [[Discord]], [[YouTube-Shorts-TikTok]]).
5. `05-Content/Queue/`, `Approved/`, `Published/` — collect all `angle` values from the last 21 days. Do not reuse any. Read `result` fields in `Published/` — if an angle produced trial starts, its siblings are welcome; if a post was rejected or removed, avoid that pattern.
6. Yesterday's `06-Research/Community-Watch/<date>.md` if present — good threads can become today's Reddit reply draft.
7. Latest `07-Metrics/Week-*.md` — the only source for any number you write.

## Output (every run)
Create in `05-Content/Queue/` using `Templates/Content.md` with **all** frontmatter fields filled:
- `<date>-x-<angle>.md` × 2 — one from the calendar row if present, one standing item (tip, thread, poll, or build-in-public). If a demo clip exists in `website/public/videos/` (check for `you-screensharing.mp4`), one of the two must be a clip caption with `format: post` and "Attach: Clip N" in the "Where / how to post" section.
- `<date>-reddit-<angle>.md` × 1 — a value post for the subreddit named in the calendar, or a comment-ready reply for the best thread in yesterday's Community-Watch. Disclosure line included. Include a link only if [[Subreddit-Rules]] marks the sub as link-allowed; otherwise write "no link — mention only if asked".
- `<date>-discord-<angle>.md` × 1 — tip, question of the day, or the announcement the calendar asks for.
- From week 2 (2026-09-21) onward: `<date>-shorts-<angle>.md` × 1 — a caption variant for an existing clip or a 15-second script idea (`format: script`), ad-safe title, `/practice` in bio.

## Writing rules
- Each post is complete: exactly what gets pasted, including the link with UTM and promo per [[Conventions#UTM and promo codes]], placed where the channel note says (X: link in first reply — write the reply too).
- X posts ≤ 280 characters each; threads as numbered tweets, product only in the last one.
- Reddit: 150-400 words, teaches something concrete, one disclosed mention at most, title ≤ 120 chars, no clickbait.
- Discord: 1-4 lines, may use one emoji.
- Never invent numbers, testimonials, or names. Never use banned words ([[Compliance-and-Ethics#5. Language rules]]).
- Fill the compliance checklist in each note honestly (leave a box unchecked if it does not apply and say why).

## Finish
- Append your run to `09-Daily-Logs/<date>.md` (create from template if missing).
- Open one PR: `marketing(social-drafter): <n> drafts for <date>`. Body lists the files and which calendar rows they fulfil.
- If the calendar has no row for today and all standing items would duplicate recent angles, write fewer pieces and say so in the PR body — quality over quota.
