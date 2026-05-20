import { globalShortcut } from 'electron'
import { HOTKEY_BINDINGS, type HotkeyAction } from '../../../shared/types'

export type HotkeyHandler = (action: HotkeyAction) => void | Promise<void>

const registered: string[] = []

export function registerInterviewHotkeys(handler: HotkeyHandler): string[] {
  unregisterInterviewHotkeys()
  const failed: string[] = []

  for (const [action, accelerator] of Object.entries(HOTKEY_BINDINGS) as Array<
    [HotkeyAction, string]
  >) {
    try {
      const ok = globalShortcut.register(accelerator, () => {
        void handler(action)
      })
      if (ok) {
        registered.push(accelerator)
      } else {
        failed.push(accelerator)
        console.warn(`Failed to register hotkey: ${accelerator}`)
      }
    } catch (error) {
      failed.push(accelerator)
      console.warn(`Error registering ${accelerator}:`, error)
    }
  }

  return failed
}

export function unregisterInterviewHotkeys(): void {
  for (const accelerator of registered) {
    globalShortcut.unregister(accelerator)
  }
  registered.length = 0
}

export function listHotkeyBindings(): typeof HOTKEY_BINDINGS {
  return { ...HOTKEY_BINDINGS }
}
