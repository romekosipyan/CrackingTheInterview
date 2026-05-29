import type { InterviewSession, InterviewSessionStartConfig } from '../../shared/types'
import type { DeviceActivationResult } from '../../shared/deviceRegistration'
import { MAX_REGISTERED_DEVICES } from '../../shared/deviceRegistration'
import {
  freeTrialBlockedMessage,
  freeTrialSessionExpiredMessage,
  isFreeTrialTimeExpired
} from '../../shared/freeTrial'
import { validateResumeUpload, validateSessionStart } from '../../shared/subscriptionEntitlements'
import {
  activateSubscription,
  consumeFreeTrialSession,
  ensurePaidDeviceAccess,
  getFreeTrialStatus
} from './subscriptionClient'

type InterviewFreeTrialContext = {
  usedMsAtStart: number
  startedAt: number
}

let interviewFreeTrialContext: InterviewFreeTrialContext | null = null

export function clearInterviewFreeTrialContext(): void {
  interviewFreeTrialContext = null
}

async function attachFreeTrialStatus(result: DeviceActivationResult): Promise<DeviceActivationResult> {
  if (result.access !== 'free') return result
  if (result.freeTrial) return result
  return { ...result, freeTrial: await getFreeTrialStatus() }
}

async function ensureFreeTrialAllowsStart(): Promise<InterviewFreeTrialContext> {
  const status = await getFreeTrialStatus()
  if (status.exhausted || status.remainingMs <= 0) {
    throw new Error(freeTrialBlockedMessage())
  }
  return {
    usedMsAtStart: status.usedMs,
    startedAt: Date.now()
  }
}

function ensureFreeTrialAllowsActiveSession(): void {
  if (!interviewFreeTrialContext) return
  if (isFreeTrialTimeExpired(interviewFreeTrialContext.startedAt, interviewFreeTrialContext.usedMsAtStart)) {
    throw new Error(freeTrialSessionExpiredMessage())
  }
}

export async function recordInterviewFreeTrialUsage(): Promise<void> {
  const context = interviewFreeTrialContext
  clearInterviewFreeTrialContext()
  if (!context) return

  const sessionMs = Date.now() - context.startedAt
  if (sessionMs <= 0) return

  try {
    await consumeFreeTrialSession(sessionMs)
  } catch {
    // Best-effort sync; local enforcement already blocked further use this session.
  }
}

export async function verifySubscriptionAccess(email: string): Promise<DeviceActivationResult> {
  const normalized = email.trim()
  if (!normalized) {
    return attachFreeTrialStatus({
      access: 'free',
      allowed: true,
      email: '',
      devices: [],
      maxDevices: MAX_REGISTERED_DEVICES,
      planNames: [],
      planId: 'free',
      planIds: []
    })
  }

  const result = await activateSubscription(normalized)
  if (result.access === 'paid' && !result.allowed) {
    throw new Error(
      result.error ??
        `This subscription is already active on ${result.maxDevices} devices. Remove one at your account page before using another machine.`
    )
  }
  return attachFreeTrialStatus(result)
}

export async function ensureSolveAccess(
  email: string,
  session: InterviewSession
): Promise<DeviceActivationResult> {
  void session
  const result = await verifySubscriptionAccess(email)
  if (result.access === 'free') {
    ensureFreeTrialAllowsActiveSession()
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

  if (result.access === 'free') {
    interviewFreeTrialContext = await ensureFreeTrialAllowsStart()
  } else {
    clearInterviewFreeTrialContext()
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
