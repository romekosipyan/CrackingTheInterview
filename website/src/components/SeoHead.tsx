import { useEffect } from 'react'

const SITE_URL = 'https://krakeninterview.com'
const DEFAULT_TITLE = 'Kraken Interview — AI Interview Copilot'
const DEFAULT_DESCRIPTION =
  'AI interview copilot for coding, system design, and behavioral rounds. Invisible on screen share. 30-minute free trial.'

export type SeoProps = {
  title?: string
  description?: string
  path?: string
  type?: 'website' | 'article'
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

function upsertMeta(name: string, content: string, attr: 'name' | 'property' = 'name'): void {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.content = content
}

function upsertLink(rel: string, href: string): void {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    document.head.appendChild(el)
  }
  el.href = href
}

function upsertJsonLd(data: Record<string, unknown> | Record<string, unknown>[]): void {
  const id = 'seo-json-ld'
  let el = document.getElementById(id) as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.id = id
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

export default function SeoHead({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  type = 'website',
  jsonLd
}: SeoProps): null {
  const fullTitle = title ? `${title} | Kraken Interview` : DEFAULT_TITLE
  const url = `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`

  useEffect(() => {
    document.title = fullTitle

    upsertMeta('description', description)
    upsertMeta('og:title', fullTitle, 'property')
    upsertMeta('og:description', description, 'property')
    upsertMeta('og:url', url, 'property')
    upsertMeta('og:type', type, 'property')
    upsertMeta('og:image', `${SITE_URL}/logo.png?v=4`, 'property')
    upsertMeta('twitter:card', 'summary_large_image')
    upsertMeta('twitter:title', fullTitle)
    upsertMeta('twitter:description', description)
    upsertMeta('twitter:image', `${SITE_URL}/logo.png?v=4`)
    upsertLink('canonical', url)

    if (jsonLd) {
      upsertJsonLd(jsonLd)
    }
  }, [fullTitle, description, url, type, jsonLd])

  return null
}

export const SOFTWARE_APP_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Kraken Interview',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Windows, macOS',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'One-time 30-minute free trial per device'
  },
  description: DEFAULT_DESCRIPTION,
  url: SITE_URL,
  downloadUrl: `${SITE_URL}/#download`
} as const
