import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HOTKEY_LABELS, formatHotkey, type HotkeyAction } from '../../../../shared/types'

const QUICK_ACTIONS: HotkeyAction[] = [
  'screenshot',
  'toggleRecording',
  'fastSolve',
  'deepSolve',
  'stop'
]

const ACTION_ICONS: Partial<Record<HotkeyAction, string>> = {
  screenshot: '📸',
  toggleRecording: '🎙️',
  fastSolve: '⚡',
  deepSolve: '🧠',
  stop: '⏹️'
}

export default function QuickActionsBar(): JSX.Element | null {
  const { t } = useTranslation()
  const [bindings, setBindings] = useState<Record<HotkeyAction, string> | null>(null)

  useEffect(() => {
    void window.api.hotkeys.list().then(setBindings)
  }, [])

  if (!bindings) return null

  return (
    <div className="quick-actions-bar">
      {QUICK_ACTIONS.map((action) => (
        <div key={action} className="quick-action-chip">
          <span className="quick-action-icon">{ACTION_ICONS[action]}</span>
          <span className="quick-action-label">{HOTKEY_LABELS[action]}</span>
          <kbd>{formatHotkey(bindings[action])}</kbd>
        </div>
      ))}
      <div className="quick-action-chip quick-action-chip-muted">
        <span className="quick-action-icon">⌨️</span>
        <span className="quick-action-label">{t('helpTitle')}</span>
        <kbd>{formatHotkey(bindings.help)}</kbd>
      </div>
    </div>
  )
}
