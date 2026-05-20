import { desktopCapturer, screen, session } from 'electron'
import { getActiveSession } from './session'

export function setupDisplayMediaHandler(): void {
  session.defaultSession.setDisplayMediaRequestHandler((_request, callback) => {
    void (async () => {
      const activeSession = getActiveSession()
      const displays = screen.getAllDisplays()
      const targetDisplay =
        displays.find((display) => String(display.id) === activeSession?.displayId) ??
        screen.getPrimaryDisplay()

      const sources = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: { width: 1, height: 1 }
      })

      const source =
        sources.find((item) => item.display_id === String(targetDisplay.id)) ??
        sources.find((item) => item.id.toLowerCase().includes('screen')) ??
        sources[0]

      if (!source) {
        callback({})
        return
      }

      callback({
        video: source,
        audio: process.platform === 'win32' ? 'loopback' : undefined
      })
    })()
  })
}
