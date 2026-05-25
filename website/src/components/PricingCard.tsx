import { Link } from 'react-router-dom'
import { useState } from 'react'
import type { PaidPlanId, SubscriptionPlan } from '@shared/subscriptionPlans'
import { startCheckout } from '../lib/api'

type Props = {
  plan: SubscriptionPlan
}

export default function PricingCard({ plan }: Props): JSX.Element {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const checkout = async (): Promise<void> => {
    if (plan.id === 'free') return
    setError('')
    setLoading(true)
    try {
      const url = await startCheckout(plan.id as PaidPlanId)
      window.location.href = url
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'Checkout failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <article className={`pricing-card${plan.highlight ? ' pricing-card-featured' : ''}`}>
      {plan.highlight && <span className="pricing-badge">Most popular</span>}
      <h3>{plan.name}</h3>
      <div className="pricing-price">
        <span className="pricing-amount">${plan.priceUsd}</span>
        {plan.intervalLabel && <span className="pricing-interval">{plan.intervalLabel}</span>}
      </div>
      <p className="pricing-note">{plan.billingNote}</p>
      <ul>
        {plan.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
      {plan.id === 'free' ? (
        <Link className="btn btn-secondary" to="/#download">
          Download free
        </Link>
      ) : (
        <>
          <button
            type="button"
            className="btn btn-primary"
            disabled={loading}
            onClick={() => void checkout()}
          >
            {loading ? 'Redirecting…' : 'Subscribe'}
          </button>
          {plan.id !== 'lifetime' && (
            <p className="hint" style={{ marginTop: '0.75rem' }}>
              Auto-renews until you cancel from My plan.
            </p>
          )}
          {error && <p className="field-error">{error}</p>}
        </>
      )}
    </article>
  )
}
