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
            Install the desktop app, configure your session, and get AI-powered answers in seconds.
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
          {winDownload && (
            <aside className="download-smartscreen-hint" aria-label="Windows install note">
              <p className="download-smartscreen-title">Windows install tip</p>
              <p>
                If you see <strong>“Windows protected your PC”</strong>, the app is signed — Windows is
                just cautious with new downloads. Click <strong>More info</strong>, confirm the publisher
                is <strong>Roman Osipyan</strong>, then choose <strong>Run anyway</strong>.
              </p>
            </aside>
          )}
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
