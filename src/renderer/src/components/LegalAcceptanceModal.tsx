import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LEGAL_VERSION } from '../../../../shared/types'

type Props = {
  open: boolean
  onAccept: () => Promise<void>
}

export default function LegalAcceptanceModal({ open, onAccept }: Props): JSX.Element | null {
  const { t } = useTranslation()
  const [checked, setChecked] = useState(false)
  const [saving, setSaving] = useState(false)

  if (!open) return null

  const handleAccept = async (): Promise<void> => {
    if (!checked || saving) return
    setSaving(true)
    try {
      await onAccept()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop legal-modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card legal-modal-card">
        <h2>{t('legalAcceptanceTitle')}</h2>
        <p className="subtitle">{t('legalAcceptanceSubtitle')}</p>

        <div className="legal-summary">
          <p>{t('legalSummaryExperimental')}</p>
          <p>{t('legalSummaryNoLiability')}</p>
          <p>{t('legalSummaryNoStorage')}</p>
          <p>{t('legalSummaryStripe')}</p>
          <p>{t('legalSummaryNoRefund')}</p>
        </div>

        <p className="hint">
          {t('legalReadFull')}{' '}
          <Link to="/terms">{t('termsOfService')}</Link>{' '}
          {t('and')}{' '}
          <Link to="/privacy">{t('privacyPolicy')}</Link>
          . {t('legalVersionLabel', { version: LEGAL_VERSION })}
        </p>

        <label className="legal-checkbox">
          <input
            type="checkbox"
            checked={checked}
            onChange={(event) => setChecked(event.target.checked)}
          />
          <span>{t('legalAcceptanceCheckbox')}</span>
        </label>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-primary"
            disabled={!checked || saving}
            onClick={() => void handleAccept()}
          >
            {saving ? t('loading') : t('legalAcceptAndContinue')}
          </button>
        </div>
      </div>
    </div>
  )
}
