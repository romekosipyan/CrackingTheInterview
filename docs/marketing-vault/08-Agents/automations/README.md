# Cursor Automations — prefill payloads

One JSON per agent. Each is the `prefillWorkflowData` used to open the Cursor Automations editor with the draft filled in (trigger, repo/branch, model, prompt). Saving happens in the editor.

| File | Agent | Schedule (UTC) | Model |
|------|-------|----------------|-------|
| `social-drafter.json` | [[Social-Drafter]] | daily 05:00 | composer-2.5-fast |
| `community-scout.json` | [[Community-Scout]] | daily 05:30 | composer-2.5-fast |
| `seo-blog-writer.json` | [[SEO-Blog-Writer]] | Mon, Thu 06:00 | composer-2.5-fast |
| `competitor-watch.json` | [[Competitor-Watch]] | Fri 06:00 | composer-2.5-fast |
| `metrics-scorecard.json` | [[Metrics-Scorecard]] | Mon 04:30 | composer-2.5-fast |
| `orchestrator.json` | [[Orchestrator]] | Sun 18:00 | claude-4.6-opus-high-thinking |

Prerequisites (human): the GitHub repo `romekosipyan/CrackingTheInterview` is connected to Cursor cloud agents; the vault is committed on `master`; for the scorecard, `EVENTS_READ_TOKEN` is available to the cloud agent as a secret (Cursor dashboard → Cloud Agents → secrets) and set in Cloudflare Pages.

Every automation's prompt is intentionally short: it points at `08-Agents/Conventions.md`, `01-Strategy/Compliance-and-Ethics.md`, and the agent's own playbook, all committed in this repo. To change an agent's behavior, edit its playbook — not the automation.
