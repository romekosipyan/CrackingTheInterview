---
type: agent-playbook
agent: agent:seo-blog-writer
schedule: Mon and Thu 06:00 UTC (08:00 Berlin)
model: cheap-fast
writes_to: [website/src/content/blog.ts, website/public/sitemap.xml, 06-Research/Keyword-Backlog.md (status column), 09-Daily-Logs/]
reads: [06-Research/Keyword-Backlog.md, 05-Content/Content-Calendar.md, 02-Channels/SEO-Blog.md, 01-Strategy/**, website/src/content/blog.ts, website/src/content/alternatives.ts]
pr_branch: marketing/seo-blog-writer-<date>
task: "[[T-028 Twice-weekly blog post]]"
---

# SEO-Blog-Writer — one genuinely useful post, twice a week

## Purpose
Add one post per run to the site that an engineer in an interview loop would bookmark, targeting one keyword from the backlog, with correct internal links and a sitemap entry. The channel compounds only if every post is good and the cadence never slips.

## Inputs
1. [[Conventions]], [[Compliance-and-Ethics]], [[SEO-Blog]] (bucket rotation, length, link rules).
2. [[Content-Calendar]] — if today's row names a blog piece, write that; otherwise take the top `status: todo` row in [[Keyword-Backlog]] following the rotation fear → compare → how-to → tool.
3. `website/src/content/blog.ts` — read the `BlogPost` interface and the two most recent posts to match tone and formatting. Never change existing slugs.
4. `website/src/content/alternatives.ts` — slugs of the 5 alternative pages for internal links.
5. `01-Strategy/Competitors/<Name>.md` — the only source for competitor prices; quote `last_checked`.

## Writing the post
- 1,200-1,800 words. `##`/`###` structure. One table where natural (compare posts always have one). Bold sparingly.
- Opening 2-3 sentences speak to the reader's situation (fear posts: acknowledge it, then get practical).
- 2-3 internal links: one alternative page or `/pricing`, one older post (`/blog/<slug>`), and `/practice` or `/` per the bucket's front door in [[SEO-Blog]]. Links are Markdown in the `body` string.
- One external authoritative link (official docs, a well-known engineering blog, a book). No links to competitor sales pages except in compare posts (their pricing page, dated).
- Kraken appears once or twice, honestly: what it helps with (structure, recall, diagrams), what it does not do (know your stuff for you). Never the banned words.
- No fabricated statistics or studies. If you want a number and cannot source it, cut it.
- Title ≤ 60 characters where possible, includes the keyword naturally. `excerpt` 140-160 characters. `tags` 3-5 lowercase. `author`: `'Kraken Interview Team'`. `date`: today's ISO date. `readingTime`: `Math.round(words/220)` + `' min read'`.
- `slug`: kebab-case, ≤ 60 chars, unique.

## Code changes (exactly these)
1. Append the new object to the `blogPosts` array in `website/src/content/blog.ts` — at the **top** of the array if the list is rendered newest-first (check `BlogPage.tsx`; if it sorts by `date`, order does not matter). Escape backticks inside the template literal body as `` \` ``.
2. Add `<url><loc>https://krakeninterview.com/blog/<slug></loc><lastmod><date></lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>` to `website/public/sitemap.xml` matching the existing entry format.
3. In [[Keyword-Backlog]], set the row's `status` to `drafted (<slug>)`.
4. Run `npm run build --prefix website` if dependencies are installed; if the build fails because of your change, fix it. If dependencies are not installed, at minimum ensure the TypeScript is syntactically valid (matching quotes, escaped backticks, trailing commas).

## Finish
- Append your run to `09-Daily-Logs/<date>.md` with the slug.
- Open one PR: `marketing(seo-blog-writer): <title> — <date>`. Body: keyword, bucket, word count, internal links used, and the line "Sitemap updated: yes".
- Do not write two posts in one run. Do not edit older posts unless the Orchestrator's task says so.
