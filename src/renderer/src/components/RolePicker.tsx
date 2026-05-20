import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { RoleCard } from '../env.d'

type Props = {
  selectedRoleId: string
  onSelect: (roleId: string) => void
}

export default function RolePicker({ selectedRoleId, onSelect }: Props): JSX.Element {
  const { t } = useTranslation()
  const [roles, setRoles] = useState<RoleCard[]>([])
  const [adding, setAdding] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ companyName: '', roleTitle: '', description: '' })

  const loadRoles = (): void => {
    void window.api.roles.list().then(setRoles)
  }

  useEffect(() => {
    loadRoles()
  }, [])

  const handleAdd = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!form.companyName.trim() || !form.roleTitle.trim()) {
      setError(t('roleRequiredFields'))
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const role = await window.api.roles.add({
        companyName: form.companyName.trim(),
        roleTitle: form.roleTitle.trim(),
        description: form.description.trim()
      })
      setRoles((prev) => [...prev, role])
      onSelect(role.id)
      setForm({ companyName: '', roleTitle: '', description: '' })
      setAdding(false)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRemove = async (id: string): Promise<void> => {
    const next = await window.api.roles.remove(id)
    setRoles(next)
    if (selectedRoleId === id) onSelect('')
  }

  return (
    <div className="field">
      <label>{t('selectRole')}</label>
      {roles.length === 0 && !adding && (
        <p className="hint">{t('noRoles')}</p>
      )}
      <div className="role-grid">
        {roles.map((role) => (
          <button
            key={role.id}
            type="button"
            className={`role-card${selectedRoleId === role.id ? ' selected' : ''}`}
            onClick={() => onSelect(role.id)}
          >
            <span className="role-company">{role.companyName}</span>
            <span className="role-title">{role.roleTitle}</span>
            <span
              className="role-remove"
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation()
                void handleRemove(role.id)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.stopPropagation()
                  void handleRemove(role.id)
                }
              }}
            >
              ×
            </span>
          </button>
        ))}
      </div>
      {!adding ? (
        <button type="button" className="btn btn-secondary role-add-btn" onClick={() => setAdding(true)}>
          {t('addRole')}
        </button>
      ) : (
        <form className="role-form" onSubmit={(e) => void handleAdd(e)}>
          <input
            placeholder={t('companyName')}
            value={form.companyName}
            onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
          />
          <input
            placeholder={t('roleTitle')}
            value={form.roleTitle}
            onChange={(e) => setForm((f) => ({ ...f, roleTitle: e.target.value }))}
          />
          <textarea
            placeholder={t('roleDescription')}
            value={form.description}
            rows={2}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
          {error && <p className="field-error">{error}</p>}
          <div className="role-form-actions">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? t('loading') : t('save')}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setAdding(false)}>
              {t('cancel')}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
