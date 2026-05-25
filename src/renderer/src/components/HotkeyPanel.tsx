import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  HOTKEY_GROUPS,
  HOTKEY_LABELS,
  formatHotkey,
  type HotkeyAction
} from '../../../../shared/types'

const HOTKEY_ICONS: Partial<Record<HotkeyAction, string>> = {
  screenshot: '📸',
  toggleRecording: '🎙️',
  fastSolve: '⚡',
  deepSolve: '🧠',
  stop: '⏹️',
  toggleSidebar: '📋',
  scrollUp: '⬆️',
  scrollDown: '⬇️',
  moveUp: '↕️',
  moveDown: '↕️',
  moveLeft: '↔️',
  moveRight: '↔️',
  help: '⌨️',
  exit: '🚪'
}

type Props = {
  visible: boolean
  failedHotkeys?: string[]
}

export default function HotkeyPanel({ visible, failedHotkeys = [] }: Props): JSX.Element {
  const { t } = useTranslation()
  const [bindings, setBindings] = useState<Record<HotkeyAction, string> | null>(null)

  useEffect(() => {
    void window.api.hotkeys.list().then(setBindings)
  }, [])

  return (
    <aside
      className={`hotkey-panel${visible ? '' : ' hotkey-panel-hidden'}`}
      aria-hidden={!visible}
    >
      {visible && bindings && (
        <>
          <div className="hotkey-panel-header">
            <strong>{t('helpTitle')}</strong>
            <span className="hotkey-panel-subtitle">{t('helpSubtitle')}</span>
          </div>

          {failedHotkeys.length > 0 && (
            <p className="hotkey-conflict">{t('hotkeyConflictDetail')}</p>
          )}

          <div className="hotkey-groups">
            {HOTKEY_GROUPS.map((group) => (
              <section key={group.title} className="hotkey-group">
                <h4>{group.title}</h4>
                <div className="hotkey-grid">
                  {group.actions.map((action) => {
                    const key = bindings[action]
                    const conflict = failedHotkeys.includes(key)
                    return (
                      <div
                        key={action}
                        className={`hotkey-card${conflict ? ' hotkey-card-conflict' : ''}`}
                      >
                        <span className="hotkey-card-icon">{HOTKEY_ICONS[action] ?? '•'}</span>
                        <div className="hotkey-card-body">
                          <span className="hotkey-card-label">{HOTKEY_LABELS[action]}</span>
                          <kbd>{formatHotkey(key)}</kbd>
                        </div>
                        {conflict && <span className="conflict-badge">!</span>}
                      </div>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        </>
      )}
    </aside>
  )
}
