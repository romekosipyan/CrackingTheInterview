---
type: strategy
topic: positioning
updated: 2026-09-10
owner: agent:orchestrator
---

# Positioning

## One sentence
**Kraken Interview is the AI interview copilot that covers every round — coding, system design with real diagrams, and behavioral — stays invisible on screen share, and costs $15/week less than the tools everyone is already paying for.**

## The category and the buyer's mindset
The buyer is a software engineer *inside* an interview loop, usually 3-14 days before a round they are afraid of. They are not browsing; they are searching in a fear state ("failed system design interview", "how to not freeze in coding interview", "interview coder alternative"). They already know copilots exist (Interview Coder, Cluely, Final Round AI made the category loud). They are deciding **which one** and **whether it will get them caught or make them sound robotic**.

That means:
- We do not need to explain what a copilot is. We need to win the comparison and the trust check.
- Trust is proven visually (split-screen demo) and socially (real users saying it worked), not with copy.
- Price is a real lever because the loop lasts 4-8 weeks and competitors charge $39/week or $69-90/month.

## Dual front doors (non-negotiable)

| | `/` (organic front door) | `/practice` (ad-safe front door) |
|---|---|---|
| Message | "100% invisible on screen share. The AI interview copilot." | "Walk in prepared. Not panicked." Interview *practice* copilot. |
| Where it is linked | Reddit, X, Hacker News, Shorts/TikTok captions, Discord, Product Hunt, blog posts about copilots | Any platform whose policy forbids "cheating" tools: YouTube descriptions when in doubt, creator sponsorships, directories, LinkedIn if ever used again, any future paid channel |
| Words allowed | invisible, undetectable on capture, overlay, stealth, live interview | practice, mock, structure, confidence, prep, non-native speakers |
| Words banned | cheat, get away with, fool the interviewer | invisible, stealth, undetectable |

Agents pick the front door per channel using [[Compliance-and-Ethics]].

## Differentiators, in the order they should be said
1. **Invisible on screen share** — OS-level capture exclusion (Windows `WDA_EXCLUDEFROMCAPTURE`, macOS `sharingType = .none`). Proven by [[Demo-Clip-Launch]] Clip 1. This is the ticket to be considered at all.
2. **Every round, one tool** — coding, system design with generated Mermaid diagrams, behavioral STAR. Competitors are mostly coding-only or text-only on design. This is the reason to pick us over the one they heard of.
3. **Answers tailored to the actual job** — paste JD URL + resume; answers reference the role's stack. Nobody else does this well.
4. **$15/week cheaper, 30-minute free trial, no account** — removes the last objection. The trial is per device, no email, which is unusual and should be said out loud: "try it on a real mock call in the next 10 minutes".

## What we never claim
- Guaranteed offers or pass rates.
- Undetectability against proctoring software we have not tested (HackerRank/CodeSignal proctoring is a separate question; say "screen share" specifically).
- Testimonials that do not exist. Placeholder-grade quotes in `website/src/content/landing.ts` must not be reused in marketing until replaced with real ones.

## Messaging by persona (see [[ICP-Personas]])

| Persona | Pain in their words | Hook |
|---------|--------------------|------|
| Loop Engineer | "I know the material, I blank under pressure on a live call." | "Structure on screen, invisible to them. 30 min free, no signup." |
| New Grad | "300 LeetCode problems and I still bombed the Google loop." | "It's not the algorithms. It's talking while you code. Here's a copilot for that." |
| Career Switcher | "I've never done a system design round. Where do I even start?" | "It draws the architecture while you talk. Design a URL shortener in 10 seconds — watch." |

## Competitive stance
Lead with **price + coverage**, never with "they are bad". Comparison content should be scrupulously accurate (prices verified weekly by [[Competitor-Watch]]) because the audience is engineers who will check. See competitor notes: [[Interview-Coder]] · [[ShadeCoder]] · [[LockedIn-AI]] · [[Final-Round-AI]] · [[Cluely]].

## Proof ladder (what we need, in order)
1. Split-screen demo clip (Clip 1) — [[T-001 Record demo Clip 1 split-screen]]
2. 5-10 real testimonials from trial users (ask in-app after a session and in Discord) — [[T-013 Collect first 5 real testimonials]]
3. One anonymized case study ("passed 3 of 4 onsites") — after first paying cohort
4. Product Hunt launch with the above — [[Product-Hunt-Launch]]
