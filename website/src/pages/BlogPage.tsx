import { Link } from 'react-router-dom'
import { blogPosts } from '../content/blog'
import { useEffect } from 'react'
import SeoHead from '../components/SeoHead'

export default function BlogPage(): JSX.Element {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="blog-page">
      <SeoHead
        title="Interview Prep Blog"
        description="Practical interview prep advice — system design frameworks, behavioral STAR method, AI copilot guides, and career tips for software engineers."
        path="/blog"
      />
      <section className="blog-hero">
        <p className="section-eyebrow">Blog</p>
        <h1>
          Interview prep insights, tips,
          <span className="hero-gradient-text"> and product updates</span>
        </h1>
        <p className="blog-hero-subtitle">
          Practical advice to help you land your next role — from system design frameworks to
          behavioral interview strategies.
        </p>
      </section>

      <div className="blog-grid">
        {blogPosts.map((post) => (
          <Link key={post.slug} to={`/blog/${post.slug}`} className="blog-card">
            <div className="blog-card-meta">
              <time>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</time>
              <span>{post.readingTime}</span>
            </div>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            <div className="blog-card-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="blog-tag">{tag}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
