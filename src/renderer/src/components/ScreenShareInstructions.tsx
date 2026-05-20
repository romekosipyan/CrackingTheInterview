import { useTranslation } from 'react-i18next'

type Props = {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ScreenShareInstructions({ open, onConfirm, onCancel }: Props): JSX.Element | null {
  const { t } = useTranslation()

  if (!open) return null

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <h2>{t('screenShareTitle')}</h2>
        <p className="subtitle">{t('screenShareSubtitle')}</p>
        <ul className="instruction-list">
          <li>{t('screenShareTip1')}</li>
          <li>{t('screenShareTip2')}</li>
          <li>{t('screenShareTip3')}</li>
          <li>{t('screenShareTip4')}</li>
        </ul>
        <p className="hint">{t('screenShareNote')}</p>
        <div className="modal-actions">
          <button type="button" className="btn btn-primary" onClick={onConfirm}>
            {t('startInterview')}
          </button>
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            {t('cancel')}
          </button>
        </div>
      </div>
    </div>
  )
}
