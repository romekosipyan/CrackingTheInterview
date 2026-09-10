---
type: agent-playbook
agent: agent:competitor-watch
schedule: Fri 06:00 UTC (08:00 Berlin)
model: cheap-fast
writes_to: [01-Strategy/Competitors/*.md, 06-Research/Competitor-Changes.md, 09-Daily-Logs/, proposals for website/src/content/alternatives.ts, website/src/components/ComparisonTable.tsx, website/src/content/blog.ts]
reads: [01-Strategy/Competitors/*.md, 06-Research/Community-Watch/*.md (this week), website/src/content/alternatives.ts, website/src/components/ComparisonTable.tsx]
pr_branch: marketing/competitor-watch-<date>
task: "[[T-029 Weekly competitor price diff]]"
---

# Competitor-Watch — keep every comparison claim true

## Purpose
Our audience checks. Every price or feature we state about [[Interview-Coder]], [[ShadeCoder]], [[LockedIn-AI]], [[Final-Round-AI]], and [[Cluely]] must match their live pages. Once a week you verify, record the diff, and propose the code changes that keep the site honest.

## Procedure
1. For each note in `01-Strategy/Competitors/`, fetch the `pricing_url` (and homepage if pricing is unreachable). Extract plan names, prices, billing periods, free tier, platforms, and the headline claim. If a page is blocked or JS-only, try a web search for `"<name>" pricing` and mark the result `unverified`.
2. Compare with the note's frontmatter and Snapshot table.
   - **No change:** update `last_checked` only.
   - **Change:** update frontmatter + Snapshot table, add a dated line under a `## Change log` heading in the note, and add a row to [[Competitor-Changes]]: `| <date> | <name> | <what changed> | <url> | <action> |`.
3. Check this week's `06-Research/Community-Watch/*.md` "Competitor mentions seen today" sections and web-search `"<name>" reddit` for the last 7 days. Add notable complaints or claims (with links) to the note's "Weaknesses / angles" section — factual, dated, no editorializing.
4. New competitor spotted (in digests or search results, e.g. a new "interview copilot" launch on Product Hunt)? Create `01-Strategy/Competitors/<Name>.md` from `Templates/Competitor.md` with whatever you verified, and add a row to Competitor-Changes with `action: orchestrator to decide on alternative page`.
5. **Site consistency.** Grep `website/src/content/alternatives.ts`, `website/src/components/ComparisonTable.tsx`, and `website/src/content/blog.ts` for the competitor's old price strings. If a price changed, update those strings in the same PR and list every changed line in the PR body under "Site changes — please review". Do not change Kraken's own prices or any claim you did not verify.

## Output
- Updated competitor notes (at minimum `last_checked` bumped on all five).
- [[Competitor-Changes]] rows for every change.
- Optional site edits when prices changed.

## Finish
- Append your run to `09-Daily-Logs/<date>.md` with a one-line summary (`5 checked, 1 changed: ShadeCoder monthly $69 → $59`).
- Open one PR: `marketing(competitor-watch): <n> checked, <m> changed — <date>`. If nothing changed and only `last_checked` moved, still open the PR (it is the audit trail), but keep the body to three lines.
