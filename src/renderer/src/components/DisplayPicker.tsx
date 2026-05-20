type Props = {
  displays: Array<{ id: string; label: string; primary: boolean }>
  value: string
  onChange: (id: string) => void
}

export default function DisplayPicker({ displays, value, onChange }: Props): JSX.Element {
  return (
    <div className="field">
      <label>Screen to capture</label>
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
