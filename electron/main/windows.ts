import { BrowserWindow, shell } from 'electron'
import path from 'path'
import { applyOverlayProtection, reapplyProtectionOnShow } from './contentProtection'

let mainWindow: BrowserWindow | null = null
let interviewWindow: BrowserWindow | null = null

function getRendererUrl(route: string): string {
  if (process.env.ELECTRON_RENDERER_URL) {
    return `${process.env.ELECTRON_RENDERER_URL}#${route}`
  }
  return `file://${path.join(__dirname, '../renderer/index.html')}#${route}`
}

export function getMainWindow(): BrowserWindow | null {
  return mainWindow
}

export function getInterviewWindow(): BrowserWindow | null {
  return interviewWindow
}

export function createMainWindow(): BrowserWindow {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.show()
    mainWindow.focus()
    return mainWindow
  }

  mainWindow = new BrowserWindow({
    width: 960,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => mainWindow?.show())
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.loadURL(getRendererUrl('/'))
  return mainWindow
}

export function setInterviewClickThrough(enabled: boolean): void {
  if (!interviewWindow || interviewWindow.isDestroyed()) return
  interviewWindow.setIgnoreMouseEvents(enabled, { forward: true })
}

export function createInterviewWindow(): BrowserWindow {
  if (interviewWindow && !interviewWindow.isDestroyed()) {
    applyOverlayProtection(interviewWindow)
    setInterviewClickThrough(true)
    interviewWindow.show()
    return interviewWindow
  }

  interviewWindow = new BrowserWindow({
    width: 1040,
    height: 720,
    minWidth: 900,
    minHeight: 560,
    x: 80,
    y: 80,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: true,
    show: false,
    hasShadow: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  })

  reapplyProtectionOnShow(interviewWindow)
  applyOverlayProtection(interviewWindow)
  setInterviewClickThrough(true)

  interviewWindow.on('show', () => setInterviewClickThrough(true))
  interviewWindow.on('focus', () => setInterviewClickThrough(true))

  interviewWindow.on('ready-to-show', () => {
    applyOverlayProtection(interviewWindow!)
    setInterviewClickThrough(true)
    interviewWindow?.show()
  })

  interviewWindow.on('closed', () => {
    interviewWindow = null
  })

  interviewWindow.loadURL(getRendererUrl('/interview'))
  return interviewWindow
}

export function hideMainWindow(): void {
  mainWindow?.hide()
}

export function showMainWindow(): void {
  if (!mainWindow || mainWindow.isDestroyed()) {
    createMainWindow()
    return
  }
  mainWindow.show()
  mainWindow.focus()
}

export function destroyInterviewWindow(): void {
  if (interviewWindow && !interviewWindow.isDestroyed()) {
    interviewWindow.close()
  }
  interviewWindow = null
}

export function toggleInterviewWindow(): void {
  if (!interviewWindow || interviewWindow.isDestroyed()) return
  if (interviewWindow.isVisible()) {
    interviewWindow.hide()
  } else {
    applyOverlayProtection(interviewWindow)
    setInterviewClickThrough(true)
    interviewWindow.show()
  }
}

export function moveInterviewWindow(dx: number, dy: number): void {
  if (!interviewWindow || interviewWindow.isDestroyed()) return
  const bounds = interviewWindow.getBounds()
  interviewWindow.setBounds({
    x: bounds.x + dx,
    y: bounds.y + dy,
    width: bounds.width,
    height: bounds.height
  })
}

export function scrollInterviewContent(delta: number): void {
  sendToInterview('overlay:scroll', { delta })
}

export function openSubscriptionUrl(url: string): void {
  void shell.openExternal(url)
}

export function sendToInterview(channel: string, payload?: unknown): void {
  if (!interviewWindow || interviewWindow.isDestroyed()) return

  const send = (): void => {
    interviewWindow?.webContents.send(channel, payload)
  }

  if (interviewWindow.webContents.isLoading()) {
    interviewWindow.webContents.once('did-finish-load', send)
  } else {
    send()
  }
}

export function sendToMain(channel: string, payload?: unknown): void {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, payload)
  }
}
