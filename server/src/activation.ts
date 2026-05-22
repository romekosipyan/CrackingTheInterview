import { activateDeviceRegistration } from '../../shared/subscriptionAccess.js'
import type { DeviceActivationResult } from '../../shared/deviceRegistration.js'
import { loadRegisteredDevices, saveRegisteredDevices } from './deviceStore.js'
import { isValidEmail } from './stripeUtils.js'
import { lookupSubscriptionsByEmail } from './subscriptions.js'
import type Stripe from 'stripe'

function toAccessItems(
  items: Awaited<ReturnType<typeof lookupSubscriptionsByEmail>>['items']
) {
  return items.map((item) => ({
    planName: item.planName,
    status: item.status,
    kind: item.kind
  }))
}

export async function activateSubscriptionDevice(
  stripe: Stripe,
  email: string,
  machineId: string,
  machineName: string
): Promise<DeviceActivationResult> {
  if (!isValidEmail(email)) {
    throw new Error('Enter a valid email address.')
  }

  const subscription = await lookupSubscriptionsByEmail(stripe, email)
  const devices = await loadRegisteredDevices(subscription.email)
  const activation = activateDeviceRegistration(
    subscription.email,
    toAccessItems(subscription.items),
    devices,
    machineId,
    machineName
  )

  if (activation.changed) {
    await saveRegisteredDevices(subscription.email, activation.devices)
  }

  return activation.result
}
