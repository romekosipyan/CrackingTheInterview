import type { InterviewSession, InterviewSessionStartConfig } from '../../shared/types'
import type { DeviceActivationResult } from '../../shared/deviceRegistration'
import { MAX_REGISTERED_DEVICES } from '../../shared/deviceRegistration'
import {
  freeSessionExpiredMessage,
  isSessionTimeExpired,
  validateResumeUpload,
  validateSessionStart
} from '../../shared/subscriptionEntitlements'
import { activateSubscription, ensurePaidDeviceAccess } from './subscriptionClient'

export async function verifySubscriptionAccess(email: string): Promise<DeviceActivationResult> {
  const normalized = email.trim()
  if (!normalized) {
    return {
      access: 'free',
      allowed: true,
      email: '',
      devices: [],
      maxDevices: MAX_REGISTERED_DEVICES,
      planNames: [],
      planId: 'free',
      planIds: []
    }
  }

  const result = await activateSubscription(normalized)
  if (result.access === 'paid' && !result.allowed) {
    throw new Error(
      result.error ??
        `This subscription is already active on ${result.maxDevices} devices. Remove one at your account page before using another machine.`
    )
  }
  return result
}

export async function ensureSolveAccess(
  email: string,
  session: InterviewSession
): Promise<DeviceActivationResult> {
  const result = await verifySubscriptionAccess(email)
  if (isSessionTimeExpired(session.startedAt, result.planId)) {
    throw new Error(freeSessionExpiredMessage())
  }
  return result
}

export async function validateInterviewStart(
  email: string,
  config: InterviewSessionStartConfig
): Promise<DeviceActivationResult> {
  const result = await verifySubscriptionAccess(email)
  const validation = validateSessionStart(result.planId, config)
  if (!validation.allowed) {
    throw new Error(validation.reason ?? 'This interview setup requires a subscription upgrade.')
  }
  return result
}

export async function validateResumeAccess(email: string): Promise<DeviceActivationResult> {
  const result = await verifySubscriptionAccess(email)
  const validation = validateResumeUpload(result.planId)
  if (!validation.allowed) {
    throw new Error(validation.reason ?? 'Resume upload requires a subscription upgrade.')
  }
  return result
}

/** @deprecated Use verifySubscriptionAccess — kept for call sites that only need device checks. */
export { ensurePaidDeviceAccess }
