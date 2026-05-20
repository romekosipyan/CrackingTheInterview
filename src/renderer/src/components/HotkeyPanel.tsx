import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HOTKEY_LABELS, type HotkeyAction } from '../../../../shared/types'

type Props = {
  visible: boolean
  failedHotkeys?: string[]
}

export default function HotkeyPanel({ visible, failedHotkeys = [] }: Props): JSX.Element | null {
  const { t } = useTranslation()
  const [bindings, setBindings] = useState<Record<HotkeyAction, string> | null>(null)

  useEffect(() => {
    void window.api.hotkeys.list().then(setBindings)
  }, [])

  if (!visible || !bindings) return null

  return (
    <aside className="hotkey-panel">
      <strong>{t('helpTitle')}</strong>
      {failedHotkeys.length > 0 && (
        <p className="hotkey-conflict">{t('hotkeyConflictDetail')}</p>
      )}
      <table>
        <tbody>
          {(Object.entries(bindings) as Array<[HotkeyAction, string]>).map(([action, key]) => {
            const conflict = failedHotkeys.includes(key)
            return (
              <tr key={action} className={conflict ? 'hotkey-row-conflict' : undefined}>
                <td>{key}</td>
                <td>
                  {HOTKEY_LABELS[action]}
                  {conflict && <span className="conflict-badge">!</span>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </aside>
  )
}
