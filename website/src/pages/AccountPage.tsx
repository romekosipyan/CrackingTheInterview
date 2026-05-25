import { useState } from 'react'
import AppDownloadButtons from '../components/AppDownloadButtons'
import {
  cancelSubscription,
  fetchDownloads,
  fetchRegisteredDevices,
  lookupSubscription,
  removeRegisteredDevice,
  type DeviceListResult,
  type DownloadInfo,
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

function formatTimestamp(unixMs: number): string {
  return new Date(unixMs).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export default function AccountPage(): JSX.Element {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [cancelingId, setCancelingId] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [result, setResult] = useState<SubscriptionLookupResult | null>(null)
  const [devices, setDevices] = useState<DeviceListResult | null>(null)
  const [devicesLoading, setDevicesLoading] = useState(false)
  const [downloads, setDownloads] = useState<DownloadInfo[]>([])
  const [downloadsLoading, setDownloadsLoading] = useState(false)

  const lookup = async (): Promise<void> => {
    setError('')
    setNotice('')
    setLoading(true)
    setDevicesLoading(true)
    try {
      const trimmed = email.trim()
      const subscription = await lookupSubscription(trimmed)
      setResult(subscription)
      if (subscription.items.length === 0) {
        setNotice('No active subscription found for this email.')
        setDownloads([])
      } else {
        setDownloadsLoading(true)
        try {
          setDownloads(await fetchDownloads())
        } catch {
          setDownloads([])
        } finally {
          setDownloadsLoading(false)
        }
      }
      try {
        const deviceList = await fetchRegisteredDevices(trimmed)
        setDevices(deviceList)
      } catch (deviceError) {
        setDevices(null)
        setError(
          deviceError instanceof Error
            ? deviceError.message
            : 'Could not load registered devices.'
        )
      }
    } catch (lookupError) {
      setResult(null)
      setDevices(null)
      setDownloads([])
      setError(lookupError instanceof Error ? lookupError.message : 'Lookup failed.')
    } finally {
      setLoading(false)
      setDevicesLoading(false)
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

  const removeDevice = async (machineId: string): Promise<void> => {
    if (!result) return
    setError('')
    setNotice('')
    setRemovingId(machineId)
    try {
      const deviceList = await removeRegisteredDevice(result.email, machineId)
      setDevices(deviceList)
      setNotice('Device removed. You can sign in on another machine now.')
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : 'Could not remove device.')
    } finally {
      setRemovingId(null)
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
                  {!item.cancelAtPeriodEnd && (
                    <p className="hint">
                      Your subscription auto-renews until you cancel. You can cancel anytime — access
                      continues through the end of the current billing period.
                    </p>
                  )}
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

      {result && result.items.length > 0 && (
        <div className="subscription-list" style={{ marginTop: '2rem' }}>
          <div className="section-heading">
            <h2>Download the app</h2>
            <p>
              Install Kraken Interview on your computer, enter <strong>{result.email}</strong> in
              Settings, then start an interview to register this device.
            </p>
          </div>
          <article className="subscription-card">
            <AppDownloadButtons downloads={downloads} loading={downloadsLoading} />
          </article>
        </div>
      )}

      {(devicesLoading || devices) && (
        <div className="subscription-list" style={{ marginTop: '2rem' }}>
          <div className="section-heading">
            <h2>Registered devices</h2>
            <p>
              Paid plans can be used on up to {devices?.maxDevices ?? 3} machines. Remove a device here if
              you need to switch computers. Devices appear after you start an interview in the desktop app
              with your subscription email saved in Settings.
            </p>
          </div>
          {devicesLoading ? (
            <p className="hint">Loading registered devices…</p>
          ) : devices && devices.devices.length === 0 ? (
            <p className="hint">No devices registered yet. Open the desktop app, enter your email in Settings, and start an interview.</p>
          ) : (
            devices?.devices.map((device) => (
              <article key={device.machineId} className="subscription-card">
                <div className="subscription-card-header">
                  <h3>{device.machineName}</h3>
                  <span className="status-pill status-active">Registered</span>
                </div>
                <p>
                  Added {formatTimestamp(device.registeredAt)} · Last seen{' '}
                  {formatTimestamp(device.lastSeenAt)}
                </p>
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={removingId === device.machineId}
                  onClick={() => void removeDevice(device.machineId)}
                >
                  {removingId === device.machineId ? 'Removing…' : 'Remove device'}
                </button>
              </article>
            ))
          )}
        </div>
      )}
    </section>
  )
}
