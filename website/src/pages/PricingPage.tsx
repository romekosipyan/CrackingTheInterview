import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { SubscriptionPlan } from '@shared/subscriptionPlans'
import { SUBSCRIPTION_PLANS } from '@shared/subscriptionPlans'
import PricingCard from '../components/PricingCard'
import { fetchPlans } from '../lib/api'

export default function PricingPage(): JSX.Element {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(SUBSCRIPTION_PLANS)
  const [searchParams] = useSearchParams()
  const canceled = searchParams.get('canceled') === '1'

  useEffect(() => {
    void fetchPlans()
      .then(setPlans)
      .catch(() => setPlans(SUBSCRIPTION_PLANS))
  }, [])

  return (
    <section className="pricing-page">
      <div className="section-heading">
        <h1>Simple, transparent pricing</h1>
        <p>Pro plans priced $15 below typical interview copilots.</p>
        {canceled && <p className="notice">Checkout canceled — pick a plan when you&apos;re ready.</p>}
      </div>
      <div className="pricing-grid">
        {plans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} />
        ))}
      </div>
      <p className="hint" style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        Already subscribed? <a href="/account">Manage your plan by email</a> — no signup required.
      </p>
    </section>
  )
}
