# KrakenInterview

KrakenInterview — AI interview copilot for coding, system design, and behavioral rounds.

## Desktop app

### Features

- **Home** — programming language, interview language, optional job description URL, display picker
- **Settings** — profile, OpenAI API key, resume upload, subscription link
- **Interview overlay** — capture-excluded transparent window (`setContentProtection`)
- **System design** — Mermaid architecture diagrams
- **JD context** — scrape job description URL at session start

### Hotkeys (during interview)

| Hotkey | Action |
|--------|--------|
| Ctrl+Shift+S | Capture screen |
| Ctrl+Shift+R | Record voice |
| Ctrl+Enter | Quick answer |
| Ctrl+Shift+Enter | Deep answer |
| Ctrl+Shift+X | Stop |
| Ctrl+Shift+I | Session panel |
| F1 | Shortcuts panel |
| Ctrl+Shift+Q | End interview |

### Setup

```bash
npm install
npm run dev
```

Add your OpenAI API key in **Settings** before using Quick/Deep answer.

### Build installers

```bash
npm run dist
```

Output: `electron-dist/` (Windows `.exe`, macOS `.dmg`). Installers are copied to `website/public/downloads/` automatically.

```bash
npm run sync:downloads   # re-copy installers after a manual build
```

Download buttons on the site load URLs from `GET /api/downloads` and serve files from `GET /downloads/:filename`.

**Production (Cloudflare):** installers live in an **R2 bucket** and are served by Pages Functions. See [Production deployment](#production-deployment-cloudflare) below.

**Local dev:** installers are read from disk by the Express server in `server/`.

---

## Marketing website + Stripe

Pricing mirrors ShadeCoder-style tiers, **$15 cheaper** on paid plans:

| Plan | Price |
|------|-------|
| Free | $0 / month |
| Pro Weekly | $24 / week (vs $39) |
| Pro Monthly | $54 / month (vs $69) |
| Lifetime | $684 one-time (vs $699) |

### Run locally

Terminal 1 — Stripe API:

```bash
cd server
cp .env.example .env
# Add Stripe keys + Price IDs (see below)
npm install
npm run dev
```

Terminal 2 — Website:

```bash
cd website
cp .env.example .env
npm install
npm run dev
```

Open [http://localhost:5174](http://localhost:5174). Desktop app **Manage subscription** opens the pricing page (`http://localhost:5174/pricing` by default).

**My plan** ([http://localhost:5174/account](http://localhost:5174/account)) — enter checkout email to view active subscriptions or lifetime access and cancel recurring plans (via Stripe).

### Stripe setup

**Automated (recommended):**

```bash
stripe login
npm run setup:stripe
```

This creates the KrakenInterview product, three prices ($24/week, $54/month, $684 lifetime), and writes `server/.env` with the Price IDs.

**Manual alternative:**

1. Create a [Stripe](https://stripe.com) account.
2. Create products/prices:
   - **Pro Weekly** — recurring, $24/week
   - **Pro Monthly** — recurring, $54/month
   - **Lifetime** — one-time, $684
3. Copy each **Price ID** into `server/.env`:
   - `STRIPE_PRICE_WEEKLY`
   - `STRIPE_PRICE_MONTHLY`
   - `STRIPE_PRICE_LIFETIME`
4. Set `STRIPE_SECRET_KEY` (restricted key recommended).

**Webhooks**

Your server handles **`checkout.session.completed`** at `POST /api/webhook`.

#### Production (Stripe Dashboard)

1. Open [Stripe Dashboard → Webhooks (test mode)](https://dashboard.stripe.com/test/webhooks).
2. Click **Add endpoint**.
3. **Endpoint URL:** `https://krakeninterview.com/api/webhook` (must be public HTTPS).
4. **Events:** select **`checkout.session.completed`** only (that is all the server uses today).
5. After creating the endpoint, open it → **Signing secret** → reveal → copy the `whsec_...` value.
6. Set `STRIPE_WEBHOOK_SECRET=whsec_...` in `server/.env` (local) or Cloudflare Pages secrets (production) and restart/redeploy.

Use a **separate live-mode endpoint** with live keys when you go to production.

#### Local development (Stripe CLI — not Dashboard)

Stripe cannot POST to `localhost` from the Dashboard. For local testing, use the Stripe CLI forwarder instead:

```bash
# Terminal 1 — API
npm run dev:server

# Terminal 2 — forward sandbox events to your machine
npm run stripe:listen
```

Copy the `whsec_...` printed by `stripe listen` into `STRIPE_WEBHOOK_SECRET` in `server/.env`, then restart the API.

> **Important:** The CLI signing secret and the Dashboard signing secret are different. Use the one that matches how events reach your server.

Checkout uses **Stripe Checkout Sessions** (hosted payment page).

---

## Production deployment (Cloudflare)

Site and API run on the same domain (e.g. [krakeninterview.com](https://krakeninterview.com)):

| URL | Handler |
|-----|---------|
| `/` | Cloudflare Pages (static Vite build) |
| `/api/*` | Pages Functions (`functions/`) |
| `/downloads/*` | Pages Functions → R2 bucket |

### 1. R2 bucket (installers)

1. Cloudflare Dashboard → **R2** → create bucket `kraken-installers`
2. Upload `KrakenInterview.exe` (and `KrakenInterview.dmg` when available)
3. Pages project → **Settings → Functions → R2 bucket bindings**
   - Variable: `INSTALLERS`
   - Bucket: `kraken-installers`

### 2. Pages build settings

| Setting | Value |
|---------|--------|
| Root directory | `/` |
| Build command | `npm run build:pages` |
| Output directory | `website/dist` |

### 3. Environment variables (Production)

Set in **Pages → Settings → Environment variables**:

| Variable | Example |
|----------|---------|
| `NODE_VERSION` | `20` |
| `WEBSITE_ORIGIN` | `https://krakeninterview.com` |
| `STRIPE_SECRET_KEY` | `sk_live_...` (encrypted) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` (encrypted) |
| `STRIPE_PRICE_WEEKLY` | `price_...` |
| `STRIPE_PRICE_MONTHLY` | `price_...` |
| `STRIPE_PRICE_LIFETIME` | `price_...` |
| `VITE_API_URL` | *(leave empty — same-origin `/api`)* |

### 4. Stripe webhook (production)

1. [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks) → **Add endpoint**
2. **URL:** `https://krakeninterview.com/api/webhook`
3. **Events:** `checkout.session.completed`
4. Copy signing secret → `STRIPE_WEBHOOK_SECRET` in Cloudflare

### 5. Verify

```text
GET  https://krakeninterview.com/api/health
GET  https://krakeninterview.com/api/downloads
GET  https://krakeninterview.com/downloads/KrakenInterview.exe
```

### Local Functions dev (optional)

```bash
npm install --prefix functions
npm run build:pages
npx wrangler pages dev website/dist
```

Use `server/` + `npm run dev:website` for local API/website development with Stripe CLI webhooks.

---

## Capture exclusion

On **Windows 10 2004+ / Windows 11**, the overlay uses `setContentProtection(true)` so it is omitted from most screen-share pipelines.

## Environment

- Node 18+
- Windows (primary) or macOS
