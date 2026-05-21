const MAX_JOB_DESCRIPTION_CHARS = 15_000
const FETCH_TIMEOUT_MS = 15_000
const MAX_RESPONSE_BYTES = 2 * 1024 * 1024

export function normalizeJobDescriptionUrl(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ''

  let parsed: URL
  try {
    parsed = new URL(trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`)
  } catch {
    throw new Error('Enter a valid job description URL (http or https).')
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Job description URL must use http or https.')
  }

  return parsed.toString()
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#(\d+);/g, (_match, code) => String.fromCharCode(Number(code)))
}

function htmlToText(html: string): string {
  return decodeHtmlEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/h[1-6]>/gi, '\n\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\r/g, '')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]{2,}/g, ' ')
      .trim()
  )
}

function extractTitle(html: string): string {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  return match ? decodeHtmlEntities(match[1].replace(/<[^>]+>/g, ' ').trim()) : ''
}

export async function scrapeJobDescription(url: string): Promise<string> {
  const normalizedUrl = normalizeJobDescriptionUrl(url)
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

  try {
    const response = await fetch(normalizedUrl, {
      signal: controller.signal,
      headers: {
        Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      redirect: 'follow'
    })

    if (!response.ok) {
      throw new Error(`Could not fetch job description (HTTP ${response.status}).`)
    }

    const contentType = response.headers.get('content-type') ?? ''
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml')) {
      throw new Error('Job description URL did not return an HTML page.')
    }

    const buffer = Buffer.from(await response.arrayBuffer())
    if (buffer.byteLength > MAX_RESPONSE_BYTES) {
      throw new Error('Job description page is too large to load.')
    }

    const html = buffer.toString('utf8')
    const title = extractTitle(html)
    const body = htmlToText(html)

    if (!body) {
      throw new Error('No readable text found on the job description page.')
    }

    const combined = title ? `${title}\n\n${body}` : body
    const trimmed = combined.trim().slice(0, MAX_JOB_DESCRIPTION_CHARS)

    if (trimmed.length < 80) {
      throw new Error('Job description page did not contain enough text.')
    }

    return trimmed
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Timed out loading the job description URL.')
    }
    if (error instanceof Error) throw error
    throw new Error('Could not load job description from that URL.')
  } finally {
    clearTimeout(timeout)
  }
}
