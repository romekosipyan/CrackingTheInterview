import { useTranslation } from 'react-i18next'

type DisplayOption = { id: string; label: string; primary: boolean }

type Props = {
  displays: DisplayOption[]
  value: string
  onChange: (id: string) => void
}

export default function DisplayPicker({ displays, value, onChange }: Props): JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="field display-picker">
      <label>{t('selectDisplay')}</label>
      <p className="hint display-picker-hint">{t('selectDisplayHint')}</p>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {displays.map((display) => (
          <option key={display.id} value={display.id}>
            {display.label}
          </option>
        ))}
      </select>
    </div>
  )
}
