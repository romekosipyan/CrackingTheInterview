# CrackingTheInterview

Electron desktop app — ShadeCoder-style AI coding interview copilot.

## Features

- **Home** — choose programming language, interview language, display, and start interview
- **Settings** — profile, defaults, app language (i18n), OpenAI API key, manage subscription (external URL stub)
- **Interview overlay** — transparent always-on-top window with capture exclusion (`setContentProtection`)
- **Hotkeys** (during interview):

| Hotkey | Action |
|--------|--------|
| Alt+S | Screenshot |
| Alt+Enter | Fast Solve |
| Alt+Shift+Enter | Deep Solve |
| Alt+C | Stop |
| Alt+N | New session |
| Alt+A | Toggle app |
| Alt+/ | Toggle sidebar |
| Alt+B | Toggle recording (stub) |
| Alt+↑/↓ | Scroll |
| Alt+Shift+↑↓←→ | Move overlay |
| Alt+H | Help |
| Alt+Esc | Exit interview |

## Setup

```bash
npm install
npm run dev
```

Add your OpenAI API key in **Settings** before using Fast/Deep Solve.

## Build

```bash
npm run dist
```

Installers output to `electron-dist/` (or a timestamped `build-output-*` folder if the previous build is still locked).

If packaging fails with **“app.asar is being used by another process”**:
1. Quit **CrackingTheInterview.exe** (check Task Manager)
2. Close any File Explorer window open inside `electron-dist/`
3. Run `npm run pack` again

## Capture exclusion

On **Windows 10 2004+ / Windows 11**, the interview overlay uses `setContentProtection(true)` (`WDA_EXCLUDEFROMCAPTURE`) so it is omitted from most screen-share pipelines. Protection is re-applied on show/focus/restore.

On **macOS**, exclusion is best-effort and varies by Electron version and meeting app.

### QA matrix

| Scenario | Windows | macOS |
|----------|---------|-------|
| Zoom screen share | Overlay absent | Best-effort |
| Teams share | Overlay absent | Best-effort |
| OBS display capture | Overlay absent | Best-effort |
| Win+Shift+S / macOS screenshot | Document behavior | Document behavior |
| User still sees overlay locally | Yes | Yes |

## Environment

- Node 18+
- Windows (primary) or macOS
