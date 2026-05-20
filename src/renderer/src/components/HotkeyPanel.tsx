import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HOTKEY_LABELS, type HotkeyAction } from '../../../../shared/types'

type Props = {
  visible: boolean
}

export default function HotkeyPanel({ visible }: Props): JSX.Element | null {
  const { t } = useTranslation()
  const [bindings, setBindings] = useState<Record<HotkeyAction, string> | null>(null)

  useEffect(() => {
    void window.api.hotkeys.list().then(setBindings)
  }, [])

  if (!visible || !bindings) return null

  return (
    <aside className="hotkey-panel">
      <strong>{t('helpTitle')}</strong>
      <table>
        <tbody>
          {(Object.entries(bindings) as Array<[HotkeyAction, string]>).map(([action, key]) => (
            <tr key={action}>
              <td>{key}</td>
              <td>{HOTKEY_LABELS[action]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </aside>
  )
}
