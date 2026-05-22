import { activateDeviceRegistration } from '../../shared/subscriptionAccess'
import type { DeviceActivationResult } from '../../shared/deviceRegistration'
import { loadRegisteredDevices, saveRegisteredDevices } from './devices'
import type { Env } from './env'
import { isValidEmail, stripeClient } from './stripeClient'
import { lookupSubscriptionsByEmail } from './subscriptions'

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
  env: Env,
  email: string,
  machineId: string,
  machineName: string
): Promise<DeviceActivationResult> {
  if (!isValidEmail(email)) {
    throw new Error('Enter a valid email address.')
  }

  const stripe = stripeClient(env)
  const subscription = await lookupSubscriptionsByEmail(env, stripe, email)
  const devices = await loadRegisteredDevices(env, subscription.email)
  const activation = activateDeviceRegistration(
    subscription.email,
    toAccessItems(subscription.items),
    devices,
    machineId,
    machineName
  )

  if (activation.changed) {
    await saveRegisteredDevices(env, subscription.email, activation.devices)
  }

  return activation.result
}
