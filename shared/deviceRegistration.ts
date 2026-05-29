export const MAX_REGISTERED_DEVICES = 3

export type RegisteredDevice = {
  machineId: string
  machineName: string
  registeredAt: number
  lastSeenAt: number
}

import type { FreeTrialStatus } from './freeTrial'
import type { SubscriptionPlanId } from './subscriptionPlans'

export type DeviceActivationResult = {
  access: 'free' | 'paid'
  allowed: boolean
  email: string
  devices: RegisteredDevice[]
  maxDevices: number
  planNames: string[]
  planId: SubscriptionPlanId
  planIds: SubscriptionPlanId[]
  freeTrial?: FreeTrialStatus
  error?: string
}

export type DeviceListResult = {
  email: string
  devices: RegisteredDevice[]
  maxDevices: number
}

export function normalizeSubscriptionEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function registerDevice(
  devices: RegisteredDevice[],
  machineId: string,
  machineName: string,
  maxDevices = MAX_REGISTERED_DEVICES
): { devices: RegisteredDevice[]; allowed: boolean; error?: string } {
  const trimmedId = machineId.trim()
  const trimmedName = machineName.trim() || 'Unknown device'
  if (!trimmedId) {
    return { devices, allowed: false, error: 'Machine ID is required.' }
  }

  const existing = devices.find((device) => device.machineId === trimmedId)
  if (existing) {
    existing.lastSeenAt = Date.now()
    existing.machineName = trimmedName
    return { devices, allowed: true }
  }

  if (devices.length >= maxDevices) {
    return {
      devices,
      allowed: false,
      error: `This subscription is already registered on ${maxDevices} devices. Remove one at your account page before using another machine.`
    }
  }

  devices.push({
    machineId: trimmedId,
    machineName: trimmedName,
    registeredAt: Date.now(),
    lastSeenAt: Date.now()
  })

  return { devices, allowed: true }
}

export function removeDevice(
  devices: RegisteredDevice[],
  machineId: string
): { devices: RegisteredDevice[]; removed: boolean } {
  const trimmedId = machineId.trim()
  const next = devices.filter((device) => device.machineId !== trimmedId)
  return { devices: next, removed: next.length !== devices.length }
}
