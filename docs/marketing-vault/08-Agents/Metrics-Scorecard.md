---
type: agent-playbook
agent: agent:metrics-scorecard
schedule: Mon 04:30 UTC (06:30 Berlin)
model: cheap-fast
writes_to: [07-Metrics/Week-<iso>.md, 00-Home.md (Scoreboard table only), 09-Daily-Logs/]
reads: [07-Metrics/**, 05-Content/Published/**, 01-Strategy/Funnel-and-Metrics.md]
pr_branch: marketing/metrics-scorecard-<date>
task: "[[T-033 Weekly scorecard]]"
---

# Metrics-Scorecard — one honest page every Monday

## Purpose
Turn last week's raw counters into a scorecard the Orchestrator and the human can act on. Blank cells are fine; invented numbers are not.

## Data sources (in order of trust)
1. **First-party counters:** `GET https://krakeninterview.com/api/track/summary?days=7` with header `Authorization: Bearer $EVENTS_READ_TOKEN`. The token is provided to the automation as a secret/environment variable named `EVENTS_READ_TOKEN`. If it is missing or the endpoint returns 401/503, write `n/a (EVENTS_READ_TOKEN not set)` in the affected cells and add a "Needs your decision" line to `00-Home.md` pointing at [[T-004 Set EVENTS_READ_TOKEN and verify track endpoint]]. Response shape: `{ from, to, days, totals: {event: n}, bySource: {event: {source: n}}, byDay: {day: {event: n}} }`. Events: `page_view`, `download_click`, `trial_started`, `checkout_start`, `purchase`, `referral_link_copied`.
2. **Stripe** (money): if a Stripe MCP tool is available to you, read active subscriptions and last-7-day successful payments (aggregate counts and amounts only, never customer data). Otherwise leave MRR blank and note "fill from Stripe Dashboard".
3. **Manual paste section:** GSC, X, YouTube/TikTok analytics are pasted by the human ([[T-012 Weekly export GSC and platform analytics into scorecard]]). Leave the tables with headers and empty rows for them.
4. `05-Content/Published/` notes from last week: list them with their `result` fields (or "result pending").

## Output
`07-Metrics/Week-<ISO week>.md` from `Templates/Weekly-Scorecard.md`, all sections present:
- North star + funnel tables with this week / last week (read last week's scorecard) / delta / target (targets in [[Funnel-and-Metrics#Targets]]).
- By-source table from `bySource` for `page_view`, `download_click`, `trial_started`, `purchase`. Sources are `utm_source` values or `ref-<host>` or `direct`.
- Published list.
- "Read" — three sentences, descriptive not speculative ("Reddit produced 4 of 6 trial starts; X produced views but no downloads; blog had no measurable traffic yet").

Then update **only** the Scoreboard table in `00-Home.md` (values for the "Last week" column; do not touch other sections) and the `updated` frontmatter date.

## Finish
- Append your run to `09-Daily-Logs/<date>.md`.
- Open one PR: `marketing(metrics-scorecard): Week <iso> — <trial starts> trials, <purchases> purchases`.
- If the summary endpoint worked but every total is zero, that is a finding — say so plainly in the Read section; do not soften it.
