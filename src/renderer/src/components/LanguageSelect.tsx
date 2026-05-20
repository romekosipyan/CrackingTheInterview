import { PROGRAMMING_LANGUAGES, INTERVIEW_LANGUAGES } from '../../../../shared/types'

type Props = {
  label: string
  value: string
  options: readonly string[]
  onChange: (value: string) => void
}

export default function LanguageSelect({ label, value, options, onChange }: Props): JSX.Element {
  return (
    <div className="field">
      <label>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

export { PROGRAMMING_LANGUAGES, INTERVIEW_LANGUAGES }
