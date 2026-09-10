---
type: campaign
status: active
starts: 2026-09-14
ends: 2026-12-06
goal: rank the 5 alternative pages and 8 new compare posts for "X alternative" / "X vs Y" queries
kpi: GSC impressions and clicks for compare queries; page_view on /*-alternative
target: 500 impressions/week by week 8; 50 clicks/week by week 12
channels: [seo]
owner: agent:seo-blog-writer
---

# Alternative Pages SEO

## Goal and hypothesis
"Interview coder alternative", "is cluely worth it", "final round ai vs interview coder" are compare-intent queries from people already holding a credit card. The pages exist (`website/src/content/alternatives.ts`); they need internal links, fresh dated prices, and supporting blog posts to rank.

## Steps
1. [[Competitor-Watch]] verifies prices weekly and proposes PRs when they change (keeps `last_checked` fresh — Google and readers reward it).
2. [[SEO-Blog-Writer]] writes the 8 compare posts from [[Keyword-Backlog]] and links each to the matching alternative page.
3. Each alternative page gets a "Related reading" block linking to its compare post (product task: [[T-015 Add related-reading block to alternative pages]]).
4. Submit updated sitemap after each batch ([[T-006 Submit sitemap to GSC and Bing]]).
5. Track impressions weekly in `07-Metrics/` scorecards (manual GSC export until automated).

## Tasks
[[T-006 Submit sitemap to GSC and Bing]] · [[T-015 Add related-reading block to alternative pages]] · [[T-016 Write 8 compare posts from backlog]]

## Results
| Date | Metric | Value | Note |
|------|--------|-------|------|

## Retro
