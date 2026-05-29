import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import Stripe from 'stripe'
import {
  PAID_PLAN_IDS,
  SUBSCRIPTION_PLANS,
  type PaidPlanId,
  type SubscriptionPlanId
} from '../../shared/subscriptionPlans.js'
import { resolveAppVersion } from './appVersion.js'
import { getDownloadByFilename, resolveDownloadAssets } from './downloads.js'
import { activateSubscriptionDevice } from './activation.js'
import { getFreeTrialStatus, consumeFreeTrialSession, syncFreeTrialUsage } from './freeTrialStore.js'
import { loadRegisteredDevices, removeRegisteredDevice } from './deviceStore.js'
import { cancelSubscription, lookupSubscriptionsByEmail } from './subscriptions.js'
import { isValidEmail } from './stripeUtils.js'
import { MAX_REGISTERED_DEVICES } from '../../shared/deviceRegistration.js'

const port = Number(process.env.PORT ?? 4242)
const websiteOrigin = process.env.WEBSITE_ORIGIN ?? 'http://localhost:5174'
const apiPublicUrl = process.env.API_PUBLIC_URL ?? `http://localhost:${port}`
const stripeSecret = process.env.STRIPE_SECRET_KEY

const app = express()
app.use(cors({ origin: websiteOrigin }))

function stripeClient(): Stripe {
  if (!stripeSecret) {
    throw new Error('STRIPE_SECRET_KEY is not configured on the server.')
  }
  return new Stripe(stripeSecret)
}

function priceIdForPlan(planId: PaidPlanId): string {
  const plan = SUBSCRIPTION_PLANS.find((item) => item.id === planId)
  const envKey = plan?.stripePriceEnv
  if (!envKey) {
    throw new Error(`Missing Stripe price mapping for plan "${planId}".`)
  }
  const priceId = process.env[envKey]
  if (!priceId) {
    throw new Error(`${envKey} is not set. Create the price in Stripe and add it to server/.env`)
  }
  return priceId
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'kraken-interview-api' })
})

app.get('/api/plans', (_req, res) => {
  res.json({ plans: SUBSCRIPTION_PLANS })
})

app.get('/api/downloads', (_req, res) => {
  const downloads = resolveDownloadAssets(apiPublicUrl)
  res.json({
    downloads: downloads.map(({ platform, label, filename, urlPath }) => ({
      platform,
      label,
      filename,
      url: urlPath
    }))
  })
})

app.get('/api/app/version', (_req, res) => {
  res.json(resolveAppVersion(apiPublicUrl))
})

app.get('/downloads/:filename', (req, res) => {
  const asset = getDownloadByFilename(req.params.filename)
  if (!asset) {
    res.status(404).json({ error: 'Installer not found. Run npm run dist && npm run sync:downloads.' })
    return
  }

  res.download(asset.absolutePath, asset.filename)
})

app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripeSecret || !webhookSecret) {
    res.status(500).send('Stripe webhook is not configured.')
    return
  }

  const stripe = stripeClient()
  const signature = req.headers['stripe-signature']
  if (!signature || typeof signature !== 'string') {
    res.status(400).send('Missing Stripe signature.')
    return
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid webhook payload.'
    res.status(400).send(message)
    return
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    console.info('[stripe] checkout completed', {
      sessionId: session.id,
      customerEmail: session.customer_details?.email,
      planId: session.metadata?.planId
    })
  }

  res.json({ received: true })
})

app.use(express.json())

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const planId = req.body?.planId as SubscriptionPlanId | undefined
    const email = typeof req.body?.email === 'string' ? req.body.email.trim() : undefined

    if (!planId || planId === 'free' || !PAID_PLAN_IDS.includes(planId as PaidPlanId)) {
      res.status(400).json({ error: 'Invalid plan selected.' })
      return
    }

    const stripe = stripeClient()
    const priceId = priceIdForPlan(planId as PaidPlanId)
    const isLifetime = planId === 'lifetime'

    const session = await stripe.checkout.sessions.create({
      mode: isLifetime ? 'payment' : 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${websiteOrigin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${websiteOrigin}/pricing?canceled=1`,
      customer_email: email || undefined,
      allow_promotion_codes: true,
      metadata: { planId }
    })

    res.json({ url: session.url })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Checkout failed.'
    res.status(500).json({ error: message })
  }
})

app.post('/api/subscription/lookup', async (req, res) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim() : ''
    if (!isValidEmail(email)) {
      res.status(400).json({ error: 'Enter a valid email address.' })
      return
    }

    const result = await lookupSubscriptionsByEmail(stripeClient(), email)
    res.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Lookup failed.'
    res.status(500).json({ error: message })
  }
})

app.post('/api/subscription/cancel', async (req, res) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim() : ''
    const subscriptionId =
      typeof req.body?.subscriptionId === 'string' ? req.body.subscriptionId.trim() : ''

    if (!isValidEmail(email)) {
      res.status(400).json({ error: 'Enter a valid email address.' })
      return
    }
    if (!subscriptionId) {
      res.status(400).json({ error: 'Subscription ID is required.' })
      return
    }

    const result = await cancelSubscription(stripeClient(), email, subscriptionId)
    res.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Cancel failed.'
    res.status(400).json({ error: message })
  }
})

app.post('/api/subscription/activate', async (req, res) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim() : ''
    const machineId = typeof req.body?.machineId === 'string' ? req.body.machineId.trim() : ''
    const machineName =
      typeof req.body?.machineName === 'string' ? req.body.machineName.trim() : 'Unknown device'

    if (!email) {
      res.status(400).json({ error: 'Email is required.' })
      return
    }
    if (!machineId) {
      res.status(400).json({ error: 'Machine ID is required.' })
      return
    }

    const result = await activateSubscriptionDevice(
      stripeClient(),
      email,
      machineId,
      machineName
    )
    res.status(result.allowed ? 200 : 403).json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Activation failed.'
    res.status(500).json({ error: message })
  }
})

app.post('/api/subscription/devices', async (req, res) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim() : ''
    if (!isValidEmail(email)) {
      res.status(400).json({ error: 'Enter a valid email address.' })
      return
    }

    const devices = await loadRegisteredDevices(email)
    res.json({ email: email.trim().toLowerCase(), devices, maxDevices: MAX_REGISTERED_DEVICES })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not load devices.'
    res.status(500).json({ error: message })
  }
})

app.post('/api/subscription/remove-device', async (req, res) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim() : ''
    const machineId = typeof req.body?.machineId === 'string' ? req.body.machineId.trim() : ''

    if (!isValidEmail(email)) {
      res.status(400).json({ error: 'Enter a valid email address.' })
      return
    }
    if (!machineId) {
      res.status(400).json({ error: 'Machine ID is required.' })
      return
    }

    const result = await removeRegisteredDevice(email, machineId)
    if (!result.removed) {
      res.status(404).json({ error: 'Device not found for this email.' })
      return
    }

    res.json({
      email: email.trim().toLowerCase(),
      devices: result.devices,
      maxDevices: MAX_REGISTERED_DEVICES
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not remove device.'
    res.status(500).json({ error: message })
  }
})

app.post('/api/free-trial/status', async (req, res) => {
  try {
    const machineId = typeof req.body?.machineId === 'string' ? req.body.machineId.trim() : ''
    if (!machineId) {
      res.status(400).json({ error: 'Machine ID is required.' })
      return
    }
    res.json(await getFreeTrialStatus(machineId))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not load free trial status.'
    res.status(500).json({ error: message })
  }
})

app.post('/api/free-trial/sync', async (req, res) => {
  try {
    const machineId = typeof req.body?.machineId === 'string' ? req.body.machineId.trim() : ''
    const addMs = typeof req.body?.addMs === 'number' ? req.body.addMs : 0
    if (!machineId) {
      res.status(400).json({ error: 'Machine ID is required.' })
      return
    }
    res.json(await syncFreeTrialUsage(machineId, addMs))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not sync free trial usage.'
    res.status(500).json({ error: message })
  }
})

app.post('/api/subscription/free-trial', async (req, res) => {
  try {
    const machineId = typeof req.body?.machineId === 'string' ? req.body.machineId.trim() : ''
    const action = typeof req.body?.action === 'string' ? req.body.action.trim() : 'status'

    if (!machineId) {
      res.status(400).json({ error: 'Machine ID is required.' })
      return
    }

    if (action === 'consume') {
      const sessionMs = typeof req.body?.sessionMs === 'number' ? req.body.sessionMs : 0
      res.json(await consumeFreeTrialSession(machineId, sessionMs))
      return
    }

    if (action === 'status') {
      res.json(await getFreeTrialStatus(machineId))
      return
    }

    res.status(400).json({ error: 'Invalid action. Use "status" or "consume".' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Free trial request failed.'
    res.status(500).json({ error: message })
  }
})

app.listen(port, () => {
  console.info(`KrakenInterview API listening on http://localhost:${port}`)
})
