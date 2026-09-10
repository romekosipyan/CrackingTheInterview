---
type: agent-conventions
updated: 2026-09-10
binding: true
---

# Conventions — every agent, every run

You are one of several agents working in `docs/marketing-vault/` of the `romekosipyan/CrackingTheInterview` repository. Read this note first, then your own playbook in `08-Agents/`, then [[Compliance-and-Ethics]]. If anything in your playbook conflicts with Compliance, Compliance wins.

## Identity and scope
- Your `owner` id is `agent:<playbook-name-in-kebab-case>` (e.g. `agent:social-drafter`). Put it in `drafted_by` / `owner` fields.
- You never post anything externally, never send messages or emails, never call third-party APIs that mutate state. You produce files in this repo and one pull request.
- You never touch: `05-Content/Approved/`, `05-Content/Published/`, `01-Strategy/Compliance-and-Ethics.md`, `08-Agents/*` (except the Orchestrator, who may edit playbooks), anything outside `docs/marketing-vault/` unless your playbook explicitly names the file (e.g. `website/src/content/blog.ts` for the SEO-Blog-Writer).

## Git and PR protocol
1. Start from the latest `master`.
2. Branch: `marketing/<agent-name>-<YYYY-MM-DD>` (UTC date). If it exists, append `-2`.
3. One PR per run. Title: `marketing(<agent-name>): <one-line summary> — <YYYY-MM-DD>`.
4. PR body: what you produced (links to files), what you skipped and why, anything the human must decide. Keep it under 20 lines.
5. Never merge. Never force-push. Never modify another agent's open branch.
6. If there is nothing to do (e.g. no new threads found), still append to the daily log and open no PR — or open a PR with only the log line if the log is the only change. Prefer no PR over a noise PR.

## Daily log (mandatory)
Append to `09-Daily-Logs/<YYYY-MM-DD>.md` (create from `Templates/Daily-Log.md` if missing) a row in the "Agent runs" table: agent, status (`ok` / `partial` / `skipped`), links to files you wrote, PR link if any. One line of "Signals worth noting" if you saw something the Orchestrator should know.

## Frontmatter is the API
Every note you create uses the matching template in `Templates/` and fills **all** frontmatter fields. Other agents and the human filter on these fields. In particular for content notes:
- `angle`: 2-4 word slug describing the idea (e.g. `proof-clip`, `design-fails-thread`). Before drafting, scan `angle` values in `Queue/`, `Approved/`, and `Published/` notes from the last 21 days and do not repeat one.
- `status`: agents only ever write `queued` or `rejected` (with a `reason` line under the post).
- `front_door`: `organic` or `ad-safe`, chosen per platform from the table in [[Compliance-and-Ethics#4. Platform-specific front doors]].

## File naming
- Content: `05-Content/Queue/<YYYY-MM-DD>-<channel>-<angle>.md`
- Community digest: `06-Research/Community-Watch/<YYYY-MM-DD>.md`
- Scorecard: `07-Metrics/Week-<ISO week, e.g. 2026-W38>.md`
- Tasks: `04-Tasks/T-<NNN> <Title>.md` (no colons, slashes, or other characters illegal on Windows)
- Never rename or delete existing notes; wikilinks depend on names.

## UTM and promo codes
Base URLs: organic `https://krakeninterview.com/`, ad-safe `https://krakeninterview.com/practice`, pricing `https://krakeninterview.com/pricing`.

| Channel | utm_source | utm_medium | promo | Example |
|---------|-----------|------------|-------|---------|
| X | `twitter` | `post` / `thread` / `bio` | `TWITTER10` | `/pricing?promo=TWITTER10&utm_source=twitter&utm_medium=post&utm_campaign=<angle>` |
| Reddit | `reddit` | `post` / `comment` | `REDDIT10` | `/?utm_source=reddit&utm_medium=post&utm_campaign=<angle>` |
| Discord | `discord` | `pinned` / `event` | `DISCORD10` | `/pricing?promo=DISCORD10&utm_source=discord&utm_medium=pinned` |
| Product Hunt | `producthunt` | `launch` | `PHUNT10` | `/pricing?promo=PHUNT10&utm_source=producthunt&utm_medium=launch` |
| Hacker News | `hackernews` | `show-hn` / `comment` | `LAUNCH10` | `/?utm_source=hackernews&utm_medium=show-hn` |
| Shorts/TikTok/IG | `youtube` / `tiktok` / `instagram` | `short` / `bio` | `LAUNCH10` | `/practice?utm_source=tiktok&utm_medium=bio` |
| Creators | `creator-<handle>` | `video` / `newsletter` | `CREATOR10` | `/practice?utm_source=creator-<handle>&utm_medium=video` |
| Blog internal | none | none | `LAUNCH10` | relative links |
| Email (future) | `email` | `drip` | `LAUNCH10` | |

`utm_campaign` = the content note's `angle`. Promo codes auto-apply via `?promo=` on `/pricing`; manual entry requires live Stripe promotion codes ([[T-005 Create live Stripe promotion codes]]).

**T-005 gate (read the task's `status` frontmatter every run):**
- `?promo=` in the URL always uses the channel code from the table (attribution).
- Spoken copy ("10% off with CODE at checkout") uses that same channel code **only if T-005 is `done`**. If T-005 is still `todo` / `doing`, spoken copy uses `LAUNCH10` (the coupon that already auto-applies) and the PR body says "T-005 still open — human: swap LAUNCH10 to the channel code after promo codes are live."

## Facts you may state
- Prices and features of Kraken: from `shared/subscriptionPlans.ts` and `shared/subscriptionEntitlements.ts` ($24/week, $54/month, $684 lifetime; weekly = unlimited coding; monthly/lifetime add JD+resume, system design diagrams, general/no-code; 30-minute free trial per device, no signup; up to 3 devices on paid).
- Competitor prices: only from `01-Strategy/Competitors/<Name>.md`, quoting `last_checked`.
- Metrics: only from `07-Metrics/`. Never round up, never estimate in public copy.
- Technical claims: OS-level capture exclusion (Windows `WDA_EXCLUDEFROMCAPTURE`, macOS `sharingType = .none`); works on Zoom, Teams, Meet screen share. Do not claim anything about proctoring software.

## Writing style
Engineer to engineer. Short sentences. Specific. No hype adjectives, no emojis unless the platform note says otherwise (Discord allows a few). Disclosure line where required. If in doubt, make the piece more useful and less promotional.

## Models and cost
Routine agents run on a cheap, fast model. Do not over-deliberate; follow the playbook literally, produce the files, open the PR. The [[Orchestrator]] (strong model, weekly) does the thinking.
