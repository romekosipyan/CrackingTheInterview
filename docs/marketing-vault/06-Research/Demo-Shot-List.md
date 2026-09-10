---
type: research
topic: demo-clips
migrated_from: docs/marketing/demo-shot-list.md
updated: 2026-09-10
campaign: "[[Demo-Clip-Launch]]"
task: "[[T-001 Record demo Clip 1 split-screen]]"
---

# Demo Video Shot-List — the single highest-leverage marketing asset

For this product, **a great split-screen demo clip outperforms any ad copy**. People
need to *see* "invisible on screen share" to believe it. This shot-list produces:

1. The **on-site demo** (drops into the existing landing-page video slots).
2. **Short vertical clips** for YouTube Shorts / TikTok / Reels / X — the viral engine.

No face or voice required. Everything below is screen-capture only.

---

## Where the on-site clips go

The landing page already renders these files (see `website/src/content/landing.ts`).
Just drop the recorded `.mp4`s into `website/public/videos/` with these exact names:

| File | Used by | Shows |
|------|---------|-------|
| `you-screensharing.mp4` | `SyncedDemoGrid` (left) | Your screen — overlay visible |
| `interviewer-view.mp4` | `SyncedDemoGrid` (right) | Interviewer's shared view — overlay absent |
| `system-design.mp4` | `SystemDesignSection` | Mermaid diagram generating live |

Keep each 8–15s, muted-friendly, looping. Export 1080p, H.264, <5 MB if possible.
You can override paths with `VITE_DEMO_VIDEO_YOU`, `VITE_DEMO_VIDEO_INTERVIEWER`,
`VITE_DEMO_VIDEO_SYSTEM_DESIGN` env vars.

---

## Clip 1 — "What you see vs what they see" (the money shot)

**Goal:** prove capture exclusion. This is THE clip. Record it first.

Setup: Start a real Zoom/Meet call with a second device or account joined. Share
your screen. Record BOTH your monitor and the joined viewer's screen simultaneously
(second device, phone camera on the viewer screen is fine, or OBS capturing the
meeting window).

| # | Duration | Your screen (left) | Interviewer view (right) |
|---|----------|--------------------|--------------------------|
| 1 | 0–2s | LeetCode "Merge k Sorted Lists" open, editor empty | Same editor, empty |
| 2 | 2–5s | Press **Alt+S** — overlay flashes up with a quick hint | Nothing changes — no overlay |
| 3 | 5–9s | Overlay shows structured approach; you type the first lines | Only your typing appears |
| 4 | 9–12s | Zoom out so the overlay is obviously on-screen | Split highlight: "They see none of this" |

On-screen text (burned in for social): `Left: your screen • Right: what the interviewer records`.

---

## Clip 2 — "System design in 10 seconds"

**Goal:** show the Mermaid diagram differentiator (competitors are text-only).

| # | Duration | Action |
|---|----------|--------|
| 1 | 0–2s | Prompt visible: "Design a URL shortener" |
| 2 | 2–4s | Press **Alt+Shift+Enter** (deep answer) |
| 3 | 4–10s | Mermaid diagram renders: client → LB → app → cache → DB, animated |
| 4 | 10–13s | Pan across labeled components |

Caption: "Other copilots give you a wall of text. Kraken draws the architecture."

---

## Clip 3 — "Tailored to the job description"

**Goal:** show JD + resume context (unique differentiator).

| # | Duration | Action |
|---|----------|--------|
| 1 | 0–3s | Paste a real JD URL + upload resume on the Home screen |
| 2 | 3–6s | Start a session, ask a generic question |
| 3 | 6–12s | Answer references the JD's stack ("given the React + Node role...") |

Caption: "Answers that match the actual role — not textbook generic."

---

## Clip 4 — "Price comparison" (motion graphic, optional)

Simple animated text, no product needed. Great for retargeting/paid.

```
Interview copilots, 2026:
Final Round AI ...... $90/mo
LockedIn AI ......... $69.99/mo
ShadeCoder .......... $69/mo
Kraken Interview .... $54/mo   ← same stealth, + system design
```

Caption: "Stop overpaying for an interview copilot." → link to `/pricing`.

---

## Distribution checklist (per clip)

- [ ] Vertical 9:16 export for Shorts/TikTok/Reels, square 1:1 for feed, 16:9 for site
- [ ] First 1.5s must hook (start on the "reveal", not the setup)
- [ ] Burned-in captions (most views are muted)
- [ ] End card: "Kraken Interview — free 30-min trial" + domain
- [ ] Post the same clip natively to each platform (don't just link)
- [ ] Link in bio / pinned comment → `krakeninterview.com/practice` (ad-safe) or `/` (organic)

## Recording tools

- **OBS Studio** (free) — scenes for "your screen" + "meeting window" side by side.
- Two accounts on one meeting, or phone recording the second screen for the raw proof shot.
- **CapCut / DaVinci Resolve** (free) for captions + vertical reframe.
