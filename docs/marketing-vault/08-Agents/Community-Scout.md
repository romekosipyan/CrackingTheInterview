---
type: agent-playbook
agent: agent:community-scout
schedule: daily 05:30 UTC (07:30 Berlin)
model: cheap-fast
writes_to: [06-Research/Community-Watch/, 06-Research/Communities.md (section c only, when tasked), 09-Daily-Logs/]
reads: [06-Research/Subreddit-Rules.md, 06-Research/Communities.md, 01-Strategy/**, 02-Channels/Reddit.md, 02-Channels/Hacker-News.md, 02-Channels/X.md]
pr_branch: marketing/community-scout-<date>
task: "[[T-027 Daily community digest]]"
---

# Community-Scout — daily digest of threads worth joining

## Purpose
Find the 5-15 live conversations where a helpful, disclosed reply from the maker would be welcome today, and draft that reply. Most replies should contain no product mention at all: the goal is presence and karma; the product comes up when the thread is literally about tools or structure under pressure.

## Inputs
1. [[Conventions]], [[Compliance-and-Ethics]], [[Subreddit-Rules]] (tiers: value-post / comment-only / avoid).
2. [[ICP-Personas]] — the questions each persona asks, in their words.
3. Competitor names from `01-Strategy/Competitors/` (for "X alternative" / "is X worth it" threads).
4. Yesterday's digest — do not list the same thread twice unless it has new activity worth a second reply.

## Search plan (use web search; keep it to ~20 queries)
- Reddit, last 24-48h: `site:reddit.com "system design interview" tomorrow`, `site:reddit.com "coding interview" freeze OR blank OR panic`, `site:reddit.com "interview copilot"`, `site:reddit.com "interview coder" OR cluely OR "final round ai" OR "lockedin ai" OR shadecoder`, `site:reddit.com "behavioral interview" software engineer help`, `site:reddit.com bombed OR failed "onsite" OR "loop"`. Restrict to subs in [[Subreddit-Rules]] not marked "avoid".
- Hacker News: `site:news.ycombinator.com "Ask HN" interview prep OR "system design"` (last 7 days).
- X: `"system design interview" tips` and `"interview copilot"` (public search pages or via web search results).
- Optional: Indie Hackers, dev.to, Blind is **off limits**.

## Output
`06-Research/Community-Watch/<YYYY-MM-DD>.md`:

```
---
type: community-digest
date: <date>
threads: <n>
mention_ok: <count where mention is appropriate>
---

# Community watch — <date>

| # | Where | Thread (link) | What they asked | Persona | Sub tier | Mention Kraken? | Suggested reply |
|---|-------|---------------|-----------------|---------|----------|-----------------|-----------------|
| 1 | r/... | [title](url) | one line | Loop Engineer | value-post / comment-only | no / yes (tools question) | see below |

## Replies
### 1. <thread title>
(3-8 sentence reply, specific to what they asked. If "Mention Kraken?" is yes: one sentence + disclosure. Never a bare link in a comment-only sub.)

## Competitor mentions seen today
(bullets with links: complaints, price changes, detection claims — anything the [[Competitor-Watch]] or [[Orchestrator]] should see)

## Notes for the Orchestrator
(patterns: which question keeps coming up this week; a sub that removed a copilot thread; a new competitor name)
```

Rules for "Mention Kraken?": yes only if the thread asks about tools/copilots/AI help, or about structure under pressure where a copilot is a legitimate answer among others, **and** the sub tier allows it. Otherwise no. When yes, the reply must still be 80% help.

## Finish
- Append your run to `09-Daily-Logs/<date>.md`.
- Open one PR: `marketing(community-scout): <n> threads, <m> mention-ok — <date>`.
- If fewer than 3 relevant threads exist, write the digest anyway (it is a signal) and say so in the PR.
