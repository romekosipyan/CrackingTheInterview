import { app } from 'electron'
import {
  MAX_REGISTERED_DEVICES,
  type DeviceActivationResult
} from '../../shared/deviceRegistration'
import { getMachineId, getMachineName } from './machineId'

const ACTIVATION_TTL_MS = 5 * 60 * 1000

let cachedActivation: { email: string; result: DeviceActivationResult; at: number } | null = null

export function getApiBaseUrl(): string {
  const configured = process.env.KRAKEN_API_URL?.trim()
  if (configured) {
    return configured.replace(/\/$/, '')
  }
  return app.isPackaged ? 'https://krakeninterview.com' : 'http://localhost:4242'
}

export function clearActivationCache(): void {
  cachedActivation = null
}

export async function activateSubscription(email: string): Promise<DeviceActivationResult> {
  const normalized = email.trim().toLowerCase()
  if (!normalized) {
    return {
      access: 'free',
      allowed: true,
      email: '',
      devices: [],
      maxDevices: MAX_REGISTERED_DEVICES,
      planNames: []
    }
  }

  if (
    cachedActivation &&
    cachedActivation.email === normalized &&
    Date.now() - cachedActivation.at < ACTIVATION_TTL_MS
  ) {
    return cachedActivation.result
  }

  const response = await fetch(`${getApiBaseUrl()}/api/subscription/activate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: normalized,
      machineId: getMachineId(),
      machineName: getMachineName()
    })
  })

  const data = (await response.json()) as DeviceActivationResult & { error?: string }
  if (!response.ok) {
    throw new Error(data.error ?? 'Could not verify subscription for this device.')
  }

  cachedActivation = { email: normalized, result: data, at: Date.now() }
  return data
}

export function getAccountUrl(): string {
  const api = getApiBaseUrl()
  if (api.includes('localhost')) {
    return 'http://localhost:5174/account'
  }
  return 'https://krakeninterview.com/account'
}

export async function ensurePaidDeviceAccess(email: string): Promise<DeviceActivationResult> {
  const result = await activateSubscription(email)
  if (result.access === 'paid' && !result.allowed) {
    throw new Error(
      result.error ??
        `This subscription is already active on ${result.maxDevices} devices. Remove one at ${getAccountUrl()}.`
    )
  }
  return result
}
