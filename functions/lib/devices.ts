import {
  MAX_REGISTERED_DEVICES,
  normalizeSubscriptionEmail,
  removeDevice,
  type RegisteredDevice
} from '../../shared/deviceRegistration'
import type { Env } from './env'

function devicesKey(email: string): string {
  return `devices:${normalizeSubscriptionEmail(email)}`
}

export async function loadRegisteredDevices(env: Env, email: string): Promise<RegisteredDevice[]> {
  const raw = await env.DEVICES.get(devicesKey(email))
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as RegisteredDevice[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function saveRegisteredDevices(
  env: Env,
  email: string,
  devices: RegisteredDevice[]
): Promise<void> {
  await env.DEVICES.put(devicesKey(email), JSON.stringify(devices))
}

export async function removeRegisteredDevice(
  env: Env,
  email: string,
  machineId: string
): Promise<{ devices: RegisteredDevice[]; removed: boolean }> {
  const devices = await loadRegisteredDevices(env, email)
  const result = removeDevice(devices, machineId)
  if (result.removed) {
    await saveRegisteredDevices(env, email, result.devices)
  }
  return result
}

export function deviceListResponse(email: string, devices: RegisteredDevice[]) {
  return {
    email: normalizeSubscriptionEmail(email),
    devices,
    maxDevices: MAX_REGISTERED_DEVICES
  }
}
