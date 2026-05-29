import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { SubscriptionPlan } from '@shared/subscriptionPlans'
import { SUBSCRIPTION_PLANS } from '@shared/subscriptionPlans'
import PricingCard from '../components/PricingCard'
import ComparisonTable from '../components/ComparisonTable'
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
        <p>One-time 30-minute free trial per device. Pro plans priced $15 below typical interview copilots.</p>
        {canceled && <p className="notice">Checkout canceled — pick a plan when you&apos;re ready.</p>}
      </div>
      <div className="pricing-grid">
        {plans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} />
        ))}
      </div>
      <div className="section-heading" style={{ marginTop: '3.5rem' }}>
        <h2>How we compare</h2>
        <p>See how Kraken Interview stacks up against other AI interview copilots.</p>
      </div>
      <ComparisonTable />
      <p className="hint" style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        Paid subscriptions auto-renew each billing period until you cancel from{' '}
        <a href="/account">My plan</a>. You can cancel anytime — access continues through the end of
        your current period.
      </p>
      <p className="hint" style={{ textAlign: 'center', marginTop: '0.75rem' }}>
        Already subscribed? <a href="/account">Manage your plan by email</a> — no signup required.
      </p>
    </section>
  )
}
