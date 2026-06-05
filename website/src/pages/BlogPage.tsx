import { useEffect } from 'react'
import SeoHead from '../components/SeoHead'

const SORO_EMBED_SCRIPT =
  'https://app.trysoro.com/api/embed/8039cb1b-2755-48e6-8f6f-b3a7ac990895?theme=dark'

export default function BlogPage(): JSX.Element {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const script = document.createElement('script')
    script.src = SORO_EMBED_SCRIPT
    script.defer = true
    document.body.appendChild(script)

    return () => {
      script.remove()
    }
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

      <div id="soro-blog" className="soro-blog-embed" />
    </div>
  )
}
