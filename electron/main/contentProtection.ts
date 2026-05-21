import type { BrowserWindow } from 'electron'

/** Set KRAKEN_RECORD_DEMO=1 to show the overlay in screen recordings (disables capture exclusion). */
export function isRecordDemoMode(): boolean {
  const flag = process.env.KRAKEN_RECORD_DEMO ?? process.env.KRAKEN_VISIBLE_ON_SHARE
  if (!flag) return false
  return flag === '1' || flag.toLowerCase() === 'true' || flag.toLowerCase() === 'yes'
}

export function applyContentProtection(window: BrowserWindow, enabled: boolean): void {
  try {
    window.setContentProtection(enabled)
  } catch (error) {
    console.warn('setContentProtection failed:', error)
  }
}

export function applyOverlayProtection(window: BrowserWindow | null): void {
  if (!window || window.isDestroyed()) return
  applyContentProtection(window, !isRecordDemoMode())
}

export function reapplyProtectionOnShow(window: BrowserWindow): void {
  window.on('show', () => applyOverlayProtection(window))
  window.on('focus', () => applyOverlayProtection(window))
  window.on('restore', () => applyOverlayProtection(window))
}
