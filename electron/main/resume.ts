import Store from 'electron-store'

export type StoredResume = {
  fileName: string
  uploadedAt: number
  text: string
}

const store = new Store<{ resume: StoredResume | null }>({
  defaults: {
    resume: null
  }
})

const MAX_RESUME_CHARS = 120_000

export function getResumeText(): string {
  return store.get('resume')?.text.trim() ?? ''
}

export function getResumeInfo(): {
  fileName: string
  uploadedAt: number
  characterCount: number
  preview: string
} | null {
  const resume = store.get('resume')
  if (!resume?.text.trim()) return null

  const text = resume.text.trim()
  return {
    fileName: resume.fileName,
    uploadedAt: resume.uploadedAt,
    characterCount: text.length,
    preview: text.slice(0, 280)
  }
}

export function saveResume(fileName: string, text: string): StoredResume {
  const trimmed = text.trim().slice(0, MAX_RESUME_CHARS)
  if (!trimmed) {
    throw new Error('Resume file is empty or could not be read.')
  }

  const resume: StoredResume = {
    fileName,
    uploadedAt: Date.now(),
    text: trimmed
  }
  store.set('resume', resume)
  return resume
}

export function clearResume(): void {
  store.delete('resume')
}

export function getResumeExport(): StoredResume | null {
  return store.get('resume') ?? null
}
