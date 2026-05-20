import { PDFParse } from 'pdf-parse'
import WordExtractor from 'word-extractor'

export const MAX_RESUME_UPLOAD_BYTES = 10 * 1024 * 1024

const SUPPORTED_EXTENSIONS = ['.txt', '.md', '.pdf', '.docx', '.doc'] as const

export function isSupportedResumeFile(fileName: string): boolean {
  const lower = fileName.toLowerCase()
  return SUPPORTED_EXTENSIONS.some((ext) => lower.endsWith(ext))
}

async function extractPdfText(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: buffer })
  try {
    const result = await parser.getText()
    return result.text
  } finally {
    await parser.destroy()
  }
}

async function extractWordText(buffer: Buffer): Promise<string> {
  const extractor = new WordExtractor()
  const document = await extractor.extract(buffer)
  return document.getBody()
}

export async function extractResumeText(fileName: string, buffer: Buffer): Promise<string> {
  if (!isSupportedResumeFile(fileName)) {
    throw new Error('Unsupported resume file type.')
  }

  if (buffer.length > MAX_RESUME_UPLOAD_BYTES) {
    throw new Error('Resume file is too large (max 10 MB).')
  }

  const lower = fileName.toLowerCase()

  if (lower.endsWith('.txt') || lower.endsWith('.md')) {
    return buffer.toString('utf8')
  }

  if (lower.endsWith('.pdf')) {
    return extractPdfText(buffer)
  }

  if (lower.endsWith('.docx') || lower.endsWith('.doc')) {
    return extractWordText(buffer)
  }

  throw new Error('Unsupported resume file type.')
}
