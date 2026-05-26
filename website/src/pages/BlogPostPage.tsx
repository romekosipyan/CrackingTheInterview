import { Link, useParams, Navigate } from 'react-router-dom'
import { blogPosts } from '../content/blog'
import { useEffect, useMemo } from 'react'

function renderMarkdown(md: string): string {
  let html = md
    // Code blocks (``` ... ```)
    .replace(/```(\w*)\n([\s\S]*?)```/g, (_m, lang, code) => {
      const escaped = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .trimEnd()
      return `<pre class="blog-code-block"${lang ? ` data-lang="${lang}"` : ''}><code>${escaped}</code></pre>`
    })
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="blog-inline-code">$1</code>')
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr />')

  // Unordered lists
  html = html.replace(/(^[-*] .+(\n|$))+/gm, (block) => {
    const items = block
      .trim()
      .split('\n')
      .map((line) => `<li>${line.replace(/^[-*] /, '')}</li>`)
      .join('')
    return `<ul>${items}</ul>`
  })

  // Paragraphs — wrap remaining loose lines
  html = html
    .split('\n\n')
    .map((block) => {
      const trimmed = block.trim()
      if (!trimmed) return ''
      if (/^<(h[1-6]|ul|ol|pre|hr|blockquote)/.test(trimmed)) return trimmed
      return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`
    })
    .join('\n')

  return html
}

export default function BlogPostPage(): JSX.Element {
  const { slug } = useParams<{ slug: string }>()
  const post = blogPosts.find((p) => p.slug === slug)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!post) {
    return <Navigate to="/blog" replace />
  }

  const bodyHtml = useMemo(() => renderMarkdown(post.body), [post.body])

  return (
    <article className="blog-post">
      <Link to="/blog" className="blog-post-back">
        &larr; Back to Blog
      </Link>

      <header className="blog-post-header">
        <div className="blog-post-meta">
          <span className="blog-post-author">{post.author}</span>
          <time>
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
          <span>{post.readingTime}</span>
        </div>
        <h1>{post.title}</h1>
        <div className="blog-post-tags">
          {post.tags.map((tag) => (
            <span key={tag} className="blog-tag">
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className="blog-post-body" dangerouslySetInnerHTML={{ __html: bodyHtml }} />

      <section className="blog-post-cta">
        <h2>Ready to ace your next interview?</h2>
        <p>
          Kraken Interview gives you real-time AI assistance for coding, system design, and
          behavioral rounds — invisible to screen share.
        </p>
        <div className="blog-post-cta-actions">
          <Link to="/pricing" className="btn btn-primary btn-lg btn-glow">
            View plans
          </Link>
          <Link to="/" className="btn btn-glass btn-lg">
            Learn more
          </Link>
        </div>
      </section>
    </article>
  )
}
