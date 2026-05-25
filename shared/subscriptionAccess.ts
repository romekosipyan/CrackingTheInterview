import {
  MAX_REGISTERED_DEVICES,
  type DeviceActivationResult,
  type RegisteredDevice,
  normalizeSubscriptionEmail,
  registerDevice
} from './deviceRegistration'
import { resolveEffectivePlanId } from './subscriptionEntitlements'
import type { SubscriptionPlanId } from './subscriptionPlans'

export type SubscriptionAccessItem = {
  planId: SubscriptionPlanId
  planName: string
  status: string
  kind: 'subscription' | 'lifetime'
}

function hasPaidAccess(items: SubscriptionAccessItem[]): boolean {
  return items.some(
    (item) =>
      item.kind === 'lifetime' ||
      item.status === 'active' ||
      item.status === 'trialing' ||
      item.status === 'past_due'
  )
}

export function buildActivationResult(
  email: string,
  items: SubscriptionAccessItem[],
  devices: RegisteredDevice[],
  registration: { devices: RegisteredDevice[]; allowed: boolean; error?: string }
): DeviceActivationResult {
  const normalized = normalizeSubscriptionEmail(email)
  const planNames = [...new Set(items.map((item) => item.planName))]
  const paid = hasPaidAccess(items)

  const planIds = [...new Set(items.map((item) => item.planId))]
  const planId = paid ? resolveEffectivePlanId(planIds) : 'free'

  if (!paid) {
    return {
      access: 'free',
      allowed: true,
      email: normalized,
      devices: [],
      maxDevices: MAX_REGISTERED_DEVICES,
      planNames: [],
      planId: 'free',
      planIds: []
    }
  }

  return {
    access: 'paid',
    allowed: registration.allowed,
    email: normalized,
    devices: registration.devices,
    maxDevices: MAX_REGISTERED_DEVICES,
    planNames,
    planId,
    planIds,
    error: registration.error
  }
}

export function activateDeviceRegistration(
  email: string,
  items: SubscriptionAccessItem[],
  devices: RegisteredDevice[],
  machineId: string,
  machineName: string
): { result: DeviceActivationResult; devices: RegisteredDevice[]; changed: boolean } {
  const normalized = normalizeSubscriptionEmail(email)
  const paid = hasPaidAccess(items)

  if (!paid) {
    return {
      result: buildActivationResult(normalized, items, devices, {
        devices,
        allowed: true
      }),
      devices,
      changed: false
    }
  }

  const registration = registerDevice([...devices], machineId, machineName, MAX_REGISTERED_DEVICES)
  const changed =
    registration.devices.length !== devices.length ||
    registration.devices.some((device, index) => device.lastSeenAt !== devices[index]?.lastSeenAt)

  return {
    result: buildActivationResult(normalized, items, registration.devices, registration),
    devices: registration.devices,
    changed
  }
}
