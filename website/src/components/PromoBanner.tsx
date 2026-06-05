import { Link } from 'react-router-dom'
import type { PromoCode } from '@shared/promoCodes'
import { PROMO_DISCOUNT_LABEL } from '@shared/promoCodes'

type Props = {
  code: PromoCode
}

export default function PromoBanner({ code }: Props): JSX.Element {
  return (
    <div className="promo-banner" role="status">
      <p>
        <strong>{code}</strong> applied — {PROMO_DISCOUNT_LABEL}. Discount is added automatically at
        checkout.
      </p>
      <Link to="/#download" className="promo-banner-link">
        Try free first →
      </Link>
    </div>
  )
}
