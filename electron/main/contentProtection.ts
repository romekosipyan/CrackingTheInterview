import type { BrowserWindow } from 'electron'

export function applyContentProtection(window: BrowserWindow, enabled: boolean): void {
  try {
    window.setContentProtection(enabled)
  } catch (error) {
    console.warn('setContentProtection failed:', error)
  }
}

export function applyOverlayProtection(window: BrowserWindow | null): void {
  if (!window || window.isDestroyed()) return
  applyContentProtection(window, true)
}

export function reapplyProtectionOnShow(window: BrowserWindow): void {
  window.on('show', () => applyOverlayProtection(window))
  window.on('focus', () => applyOverlayProtection(window))
  window.on('restore', () => applyOverlayProtection(window))
}
