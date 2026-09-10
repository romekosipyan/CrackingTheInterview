---
type: strategy
topic: playbook-v1
migrated_from: docs/marketing/growth-playbook.md
updated: 2026-09-10
superseded_by: "[[Roadmap-90-Day]]"
---

# Kraken Interview — Growth Playbook

> Migrated into the vault on 2026-09-10. Where this note and the channel notes in `02-Channels/` disagree, the channel notes win (notably: LinkedIn is no longer a Tier 2 channel — see [[Compliance-and-Ethics]] and [[Relaunch-Plan]]). Copy-paste posts referenced below are in [[Social-Posts-Week1]].

**Goal:** Convert high-intent job seekers into paid subscribers via free trial → Pro Weekly/Monthly.

**Site:** https://krakeninterview.com  
**Funnel:** Discover → Download (30-min trial) → Subscribe → Retain

---

## Positioning

| Element | Message |
|---------|---------|
| **Category** | AI interview copilot (desktop app) |
| **Differentiator #1** | 100% invisible on screen share (OS capture exclusion) |
| **Differentiator #2** | Coding + system design (Mermaid) + behavioral in one tool |
| **Differentiator #3** | JD + resume context for role-specific answers |
| **Price anchor** | $15 less than leading competitors ($24/wk vs ~$39) |
| **Risk reversal** | One-time 30-minute free trial per device, no signup |

**Target audience (priority order):**
1. Software engineers in active interview loops (FAANG, startups, remote)
2. Bootcamp grads / new grads facing first technical rounds
3. Career switchers preparing for system design + behavioral

---

## Channel Strategy (90-day)

### Tier 1 — Highest ROI (start now)

| Channel | Tactic | KPI | Owner action |
|---------|--------|-----|--------------|
| **SEO / Blog** | 2 posts/week targeting interview prep + copilot keywords | Organic sessions → `/pricing` | Publish posts in `website/src/content/blog.ts` |
| **Reddit** | Value-first posts in r/cscareerquestions, r/leetcode, r/interviews | Trial downloads (UTM: `utm_source=reddit`) | Use posts in `social-posts-week1.md` |
| **X / Twitter** | Demo clips, tips threads, comparison hooks | Link clicks | Post from @krakeninterview daily |
| **Discord** | `#interview-prep`, weekly mock round, trial reminders | Community → trial → sub | Pin download + pricing in Discord |
| **Product Hunt** | Launch day blitz | Upvotes + signups | Update `/launch` with live PH URL when ready |

### Tier 2 — Scale after week 2

| Channel | Tactic |
|---------|--------|
| **YouTube Shorts / TikTok** | 30s "interviewer view vs your view" split-screen demos |
| **LinkedIn** | Carousel: "5 system design mistakes" → CTA to blog |
| **Indie Hackers / Hacker News** | Show HN when you have traction metrics |
| **Affiliate / referral** | Stripe promotion codes for creators (10% off first month) |

### Tier 3 — Paid (when CAC is validated)

- Google Ads on "AI interview assistant", "coding interview help"
- Retargeting pixel via GA4 audiences
- Sponsorships in interview prep newsletters

---

## Conversion Funnel Optimizations

1. **Landing hero** — Free trial badge + download CTAs above fold ✓
2. **Blog posts** — CTA block at bottom + share buttons ✓
3. **Pricing page** — Comparison table vs competitors ✓
4. **Post-checkout** — Success page → Discord invite
5. **In-app** — Share session card after successful interview (already built)

**UTM convention:**
```
?utm_source={channel}&utm_medium={type}&utm_campaign={campaign}
```
Examples:
- `?utm_source=reddit&utm_medium=post&utm_campaign=system-design-tips`
- `?utm_source=twitter&utm_medium=thread&utm_campaign=launch-week`

---

## Content Calendar — Week 1

| Day | Channel | Content |
|-----|---------|---------|
| Mon | Blog | Publish "Best AI Interview Copilot 2026" |
| Mon | X | Thread: 5 things copilots get wrong + Kraken fix |
| Tue | Reddit | r/cscareerquestions — system design framework (no hard sell) |
| Wed | Blog | Publish "Kraken vs Competitors" comparison |
| Wed | LinkedIn | Share comparison blog + personal story |
| Thu | X | Demo GIF: invisible overlay side-by-side |
| Fri | Reddit | r/leetcode — "Beyond grinding" prep tips |
| Fri | Discord | "Friday mock round" event announcement |
| Sat | Blog | Publish "How to use AI during coding interviews" |
| Sun | X | Poll: "What's your hardest interview round?" |

See `social-posts-week1.md` for copy-paste posts.

---

## Product Hunt Launch Checklist

- [ ] Create Product Hunt listing (tagline, gallery, maker comment)
- [ ] Replace placeholder URL in `LaunchPage.tsx` with live PH link
- [ ] Schedule launch for Tuesday 12:01 AM PT
- [ ] Email Discord + X followers 24h before
- [ ] Prepare 10 friends/family to upvote in first hour
- [ ] Maker comment: story + free trial offer + demo video link
- [ ] Respond to every PH comment within 30 min on launch day

---

## Metrics to Track (GA4 + Stripe)

| Metric | Target (Month 1) |
|--------|------------------|
| Site sessions | 5,000 |
| Trial downloads | 500 |
| Trial → paid conversion | 5–10% |
| MRR | $2,500+ |
| Top traffic source | SEO or Reddit |

Events already tracked: `page_view`, checkout clicks. Add custom events for `download_click`, `trial_started` if not present.

---

## Competitive Messaging (use in ads & posts)

**vs Competitor A (ShadeCoder-style):**
- $15 cheaper on every tier
- System design with Mermaid diagrams (not basic text)
- Behavioral STAR mode included
- JD + resume context on Pro Monthly

**Objection handling:**
| Objection | Response |
|-----------|----------|
| "Is this cheating?" | Tool for structure & recall — like notes in open-book. You still communicate. |
| "Will they detect it?" | OS-level capture exclusion; demo video shows interviewer view. |
| "Too expensive" | $24/wk vs $39; 30-min free trial first. |
| "I only need coding" | Pro Weekly covers unlimited coding; upgrade for system design. |

---

## Immediate Actions (this week)

1. **Deploy** SEO updates (sitemap, blog posts, meta tags)
2. **Post** 3 Reddit + 5 X threads from `social-posts-week1.md`
3. **Record** 60-second demo: your screen vs interviewer screen
4. **Promo codes live** — coupon `EIFrYMaw` (10% off first payment). Auto-apply via `?promo=LAUNCH10` on `/pricing`. Run `npm run setup:promos` with live `STRIPE_SECRET_KEY` to create Stripe promotion codes for manual checkout entry.
5. **Submit** sitemap to Google Search Console: `https://krakeninterview.com/sitemap.xml`
6. **Pin** Discord message with download link + trial explanation

---

## Long-term (Month 2–3)

- Guest posts on Levels.fyi, Blind-adjacent blogs (careful with ToS)
- YouTube channel: weekly "design X in 45 min" with Kraken demo
- Case study page: "How [anonymous] passed 4 FAANG loops"
- Email drip for trial users who didn't convert (requires email capture — future feature)
- Referral program: give 1 week free for each paid referral
