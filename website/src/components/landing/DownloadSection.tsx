import type { DownloadInfo } from '../../lib/api'

type Props = {
  downloads: DownloadInfo[]
  downloadError: string
}

export default function DownloadSection({ downloads, downloadError }: Props): JSX.Element {
  const winDownload = downloads.find((item) => item.platform === 'win')
  const macDownload = downloads.find((item) => item.platform === 'mac')

  return (
    <section id="download" className="landing-section download-section download-section--fancy">
      <div className="landing-section-inner">
        <div className="download-panel">
          <p className="section-eyebrow">Get started</p>
          <h2>Download Kraken Interview</h2>
        <p className="section-lead">
          Install the desktop app, add your OpenAI key in Settings, and start your session.
        </p>
        <div className="download-actions">
          {macDownload ? (
            <a className="btn btn-primary btn-glow btn-lg" href={macDownload.url} download={macDownload.filename}>
              Download on Mac
            </a>
          ) : (
            <span className="btn btn-primary btn-disabled btn-lg">Mac build unavailable</span>
          )}
          {winDownload ? (
            <a className="btn btn-glass btn-lg" href={winDownload.url} download={winDownload.filename}>
              Download on Windows
            </a>
          ) : (
            <span className="btn btn-glass btn-disabled btn-lg">Windows build unavailable</span>
          )}
        </div>
        {!winDownload && !macDownload && (
          <p className="field-error">
            {downloadError || 'No installers found yet. Run npm run dist && npm run sync:downloads.'}
          </p>
        )}
        </div>
      </div>
    </section>
  )
}
