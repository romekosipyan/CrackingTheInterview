import type { DownloadInfo } from '../lib/api'

type Props = {
  downloads: DownloadInfo[]
  loading?: boolean
}

export default function AppDownloadButtons({ downloads, loading = false }: Props): JSX.Element {
  const winDownload = downloads.find((item) => item.platform === 'win')
  const macDownload = downloads.find((item) => item.platform === 'mac')

  if (loading) {
    return <p className="hint">Loading download links…</p>
  }

  return (
    <div className="account-downloads">
      <div className="download-actions">
        {winDownload ? (
          <a className="btn btn-primary" href={winDownload.url} download={winDownload.filename}>
            Download for Windows
          </a>
        ) : (
          <span className="btn btn-primary btn-disabled">Windows build unavailable</span>
        )}
        {macDownload ? (
          <a className="btn btn-secondary" href={macDownload.url} download={macDownload.filename}>
            Download for Mac
          </a>
        ) : (
          <span className="btn btn-secondary btn-disabled">Mac build unavailable</span>
        )}
      </div>
      {!winDownload && !macDownload && (
        <p className="hint">Installers are not available yet. Check back soon or contact support.</p>
      )}
    </div>
  )
}
