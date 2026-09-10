---
type: strategy
topic: compliance
updated: 2026-09-10
binding: true
owner: human
---

# Compliance and ethics — binding for every agent and every post

These rules protect the accounts, the brand, and the person whose name is on the company. They are not negotiable and are not subject to the Orchestrator's re-prioritization. If a task conflicts with this note, the task is wrong.

## 1. Disclosure, always
- Every Reddit post or comment, Hacker News comment, Discord message in a server we do not own, forum reply, or quote-tweet that mentions Kraken Interview includes a disclosure in the first or last line.
- Canonical line: **"Disclosure: I'm the maker of Kraken Interview."** Variants allowed: "(full disclosure — I built this)", "I work on Kraken Interview, so I'm biased."
- No sock puppets, no alt accounts, no "a friend recommended", no fake user personas. One maker account per platform.

## 2. No fabricated proof
- No invented testimonials, review counts, user numbers, star ratings, "as seen in", or "used by engineers at Google" unless literally documented in `07-Metrics/` or a `Published/` note with a source.
- Placeholder quotes in `website/src/content/landing.ts` are not to be quoted in marketing. Replace them with real ones from [[T-013 Collect first 5 real testimonials]].
- Comparison claims (prices, features) must match the latest competitor note (`01-Strategy/Competitors/`) with a `last_checked` date. If unsure, say "as of <date>" and link to their pricing page.

## 3. No manipulation
- No asking for upvotes/votes anywhere except as allowed by the platform (Product Hunt allows "check us out"; it forbids asking for upvotes). Never coordinate vote rings.
- No mass DMs. No scraping user lists for outreach. Creator outreach is one personal message per creator, in public contact channels.
- No engagement bait ("comment 'AI' to get the link").

## 4. Platform-specific front doors
| Platform | Front door | Notes |
|----------|-----------|-------|
| Reddit organic | `/` | Value-first; link only where [[Subreddit-Rules]] allows; disclosure |
| X | `/` | Demo clips native; link in reply or bio |
| Hacker News | `/` | Show HN honesty: what it does, how capture exclusion works, what it does not do |
| Product Hunt | `/` (`/launch`) | Maker comment tells the story straight |
| YouTube / TikTok / Instagram | `/practice` in description; clip content may show the overlay | Their policies on "academic dishonesty / cheating" tools are enforced inconsistently; do not use "cheat" or "undetectable" in titles |
| Creators / sponsorships | `/practice` | Protects the creator's channel |
| Directories (AlternativeTo, TAAFT, Futurepedia, SaaSHub) | `/practice` for description; homepage link can be `/` | Read each directory's content policy |
| LinkedIn | do not use | Hostile audience, ad policy rejects; see [[Relaunch-Plan]] |
| Blind, Glassdoor, Levels.fyi forums | do not post | ToS and audience hostility |
| Any paid ads (future) | `/practice` only | Zero budget now |

## 5. Language rules (our own voice)
- Never: cheat, cheating, get away with, fool, trick, beat the interviewer, undetectable (except in a precise technical sense about screen-share capture), guaranteed.
- Prefer: structure, recall, stay composed, copilot, practice, invisible on screen share (technical claim we can demo), OS-level capture exclusion.
- Frame honestly: "It is a tool for structure and recall on a live call, like notes in an open-book exam. You still have to communicate and you still have to know your stuff."

## 6. Competitor references
- Name competitors only in comparison content (alternative pages, comparison tables, "X vs Y" posts). Never in a disparaging tone. Never claim they are "detectable" or "unsafe" without a reproducible, dated test in `06-Research/`.
- Do not target competitors' brand names in any future paid campaigns without legal review.

## 7. Privacy and data
- No user emails or machine IDs ever appear in the vault. Scorecards use aggregates only.
- Testimonials require written consent (a Discord/email message saved outside the repo) and are attributed only as the user chose (first name, initials, or anonymous).

## 8. Agent guardrails
- Agents write only to their allowed paths ([[Conventions]]). They never post externally, never send messages, never touch `Approved/` or `Published/`.
- Every content note carries the compliance checklist from `Templates/Content.md`; the human checks it before posting.
- If an agent cannot satisfy this note for a given piece, it writes the piece with `status: rejected` and a one-line reason so the Orchestrator can learn from it.
