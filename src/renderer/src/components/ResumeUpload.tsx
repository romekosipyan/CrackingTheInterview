import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

export type ResumeInfo = {
  fileName: string
  uploadedAt: number
  characterCount: number
  preview: string
}

type Props = {
  resume: ResumeInfo | null
  onResumeChange: (resume: ResumeInfo | null) => void
}

const ACCEPTED_EXTENSIONS = ['.txt', '.md', '.pdf', '.docx', '.doc']
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

async function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('Failed to read resume file'))
        return
      }
      const commaIndex = reader.result.indexOf(',')
      resolve(commaIndex >= 0 ? reader.result.slice(commaIndex + 1) : reader.result)
    }
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read resume file'))
    reader.readAsDataURL(file)
  })
}

export default function ResumeUpload({ resume, onResumeChange }: Props): JSX.Element {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const lowerName = file.name.toLowerCase()
    if (!ACCEPTED_EXTENSIONS.some((ext) => lowerName.endsWith(ext))) {
      setError(t('resumeInvalidType'))
      return
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      setError(t('resumeTooLarge'))
      return
    }

    setUploading(true)
    setError('')
    try {
      const base64 = await readFileAsBase64(file)
      const saved = await window.api.resume.upload({ fileName: file.name, base64 })
      onResumeChange(saved)
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : t('resumeUploadFailed')
      setError(message)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = async (): Promise<void> => {
    await window.api.resume.clear()
    onResumeChange(null)
    setError('')
  }

  return (
    <div className="resume-upload">
      <p className="hint">{t('resumeLocalNote')}</p>

      {resume ? (
        <div className="resume-card">
          <strong>{resume.fileName}</strong>
          <p className="hint">
            {t('resumeUploadedAt', {
              date: new Date(resume.uploadedAt).toLocaleString(),
              count: resume.characterCount
            })}
          </p>
          <p className="resume-preview">
            {resume.preview}
            {resume.characterCount > 280 ? '…' : ''}
          </p>
          <button type="button" className="btn btn-secondary" onClick={() => void handleRemove()}>
            {t('resumeRemove')}
          </button>
        </div>
      ) : (
        <p className="hint">{t('resumeNone')}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.md,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown"
        hidden
        onChange={(event) => void handleFileChange(event)}
      />

      <button
        type="button"
        className="btn btn-secondary"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? t('loading') : resume ? t('resumeReplace') : t('resumeUpload')}
      </button>

      {error && <p className="field-error">{error}</p>}
    </div>
  )
}
