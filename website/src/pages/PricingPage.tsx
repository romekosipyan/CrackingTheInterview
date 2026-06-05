import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { SubscriptionPlan } from '@shared/subscriptionPlans'
import { SUBSCRIPTION_PLANS } from '@shared/subscriptionPlans'
import PricingCard from '../components/PricingCard'
import ComparisonTable from '../components/ComparisonTable'
import { fetchPlans } from '../lib/api'
import SeoHead from '../components/SeoHead'
import PromoBanner from '../components/PromoBanner'
import { normalizePromoCode } from '@shared/promoCodes'

export default function PricingPage(): JSX.Element {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(SUBSCRIPTION_PLANS)
  const [searchParams] = useSearchParams()
  const canceled = searchParams.get('canceled') === '1'
  const promoCode = normalizePromoCode(searchParams.get('promo'))

  useEffect(() => {
    void fetchPlans()
      .then(setPlans)
      .catch(() => setPlans(SUBSCRIPTION_PLANS))
  }, [])

  return (
    <section className="pricing-page">
      <SeoHead
        title="Pricing — Pro from $24/week"
        description="Simple, transparent pricing. One-time 30-minute free trial. Pro Weekly $24, Pro Monthly $54, Lifetime $684. $15 less than leading interview copilots."
        path="/pricing"
      />
      <div className="section-heading">
        <h1>Simple, transparent pricing</h1>
        <p>One-time 30-minute free trial per device. Pro plans priced $15 below typical interview copilots.</p>
        {canceled && <p className="notice">Checkout canceled — pick a plan when you&apos;re ready.</p>}
        {!promoCode && (
          <p className="hint" style={{ marginTop: '0.75rem' }}>
            Launch offer:{' '}
            <a href="/pricing?promo=LAUNCH10">
              <strong>LAUNCH10</strong> — 10% off your first payment
            </a>{' '}
            (applied automatically when you subscribe).
          </p>
        )}
      </div>
      {promoCode && <PromoBanner code={promoCode} />}
      <div className="pricing-grid">
        {plans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} promoCode={promoCode ?? undefined} />
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
