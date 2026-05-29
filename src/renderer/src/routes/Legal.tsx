import { Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import LegalDocument from '../components/LegalDocument'
import { PRIVACY_POLICY, TERMS_OF_SERVICE } from '../legal/content'
import { useShellMode } from '../hooks/useShellMode'

export default function Legal(): JSX.Element {
  const { t } = useTranslation()
  const location = useLocation()
  useShellMode()
  const isPrivacy = location.pathname.includes('privacy')
  const legalDocument = isPrivacy ? PRIVACY_POLICY : TERMS_OF_SERVICE

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="page shell-page legal-page">
      <div className="card shell-card shell-card--scroll legal-card">
        <LegalDocument document={legalDocument} />
        <div className="footer-links legal-footer">
          <Link to="/">{t('back')}</Link>
          {isPrivacy ? (
            <Link to="/terms">{t('termsOfService')}</Link>
          ) : (
            <Link to="/privacy">{t('privacyPolicy')}</Link>
          )}
        </div>
      </div>
    </div>
  )
}
