import { useState } from 'react'
import {
  cancelSubscription,
  lookupSubscription,
  type SubscriptionItem,
  type SubscriptionLookupResult
} from '../lib/api'

function formatDate(unixSeconds?: number): string {
  if (!unixSeconds) return '—'
  return new Date(unixSeconds * 1000).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function AccountPage(): JSX.Element {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [cancelingId, setCancelingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [result, setResult] = useState<SubscriptionLookupResult | null>(null)

  const lookup = async (): Promise<void> => {
    setError('')
    setNotice('')
    setLoading(true)
    try {
      const data = await lookupSubscription(email.trim())
      setResult(data)
      if (data.items.length === 0) {
        setNotice('No active subscription found for this email.')
      }
    } catch (lookupError) {
      setResult(null)
      setError(lookupError instanceof Error ? lookupError.message : 'Lookup failed.')
    } finally {
      setLoading(false)
    }
  }

  const cancel = async (item: SubscriptionItem): Promise<void> => {
    if (!item.subscriptionId || !result) return
    setError('')
    setNotice('')
    setCancelingId(item.subscriptionId)
    try {
      const response = await cancelSubscription(result.email, item.subscriptionId)
      setNotice(
        `Subscription canceled. Access continues until ${formatDate(response.currentPeriodEnd)}.`
      )
      await lookup()
    } catch (cancelError) {
      setError(cancelError instanceof Error ? cancelError.message : 'Cancel failed.')
    } finally {
      setCancelingId(null)
    }
  }

  return (
    <section className="account-page">
      <div className="section-heading">
        <h1>Your subscription</h1>
        <p>Enter the email you used at checkout. No password or account signup required.</p>
      </div>

      <form
        className="account-form"
        onSubmit={(event) => {
          event.preventDefault()
          void lookup()
        }}
      >
        <label htmlFor="account-email">Email address</label>
        <div className="account-form-row">
          <input
            id="account-email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Looking up…' : 'Look up plan'}
          </button>
        </div>
      </form>

      {error && <p className="field-error">{error}</p>}
      {notice && <p className="notice">{notice}</p>}

      {result && result.items.length > 0 && (
        <div className="subscription-list">
          {result.items.map((item) => (
            <article key={`${item.kind}-${item.subscriptionId ?? item.planId}`} className="subscription-card">
              <div className="subscription-card-header">
                <h3>{item.planName}</h3>
                <span className={`status-pill status-${item.status}`}>{item.status}</span>
              </div>
              {item.kind === 'lifetime' ? (
                <p>Lifetime access — no recurring billing.</p>
              ) : (
                <>
                  <p>
                    {item.cancelAtPeriodEnd
                      ? `Cancels on ${formatDate(item.currentPeriodEnd)}`
                      : `Renews on ${formatDate(item.currentPeriodEnd)}`}
                  </p>
                  {item.subscriptionId && !item.cancelAtPeriodEnd && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      disabled={cancelingId === item.subscriptionId}
                      onClick={() => void cancel(item)}
                    >
                      {cancelingId === item.subscriptionId ? 'Canceling…' : 'Cancel subscription'}
                    </button>
                  )}
                  {item.cancelAtPeriodEnd && (
                    <p className="hint">Cancellation is scheduled via Stripe.</p>
                  )}
                </>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
