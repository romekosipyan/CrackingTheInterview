import { FREE_SESSION_LIMIT_MS } from './subscriptionEntitlements'

export type FreeTrialStatus = {
  limitMs: number
  usedMs: number
  remainingMs: number
  exhausted: boolean
}

export type FreeTrialRecord = {
  machineId: string
  usedMs: number
  exhausted: boolean
  firstUsedAt: number
  lastUsedAt: number
}

export function freeTrialKey(machineId: string): string {
  return `freeTrial:${machineId.trim()}`
}

export function emptyFreeTrialRecord(machineId: string): FreeTrialRecord {
  const now = Date.now()
  return {
    machineId: machineId.trim(),
    usedMs: 0,
    exhausted: false,
    firstUsedAt: now,
    lastUsedAt: now
  }
}

export function toFreeTrialStatus(record: FreeTrialRecord): FreeTrialStatus {
  const usedMs = Math.min(record.usedMs, FREE_SESSION_LIMIT_MS)
  const remainingMs = Math.max(0, FREE_SESSION_LIMIT_MS - usedMs)
  return {
    limitMs: FREE_SESSION_LIMIT_MS,
    usedMs,
    remainingMs,
    exhausted: record.exhausted || usedMs >= FREE_SESSION_LIMIT_MS
  }
}

export function applyFreeTrialUsage(
  record: FreeTrialRecord,
  sessionMs: number
): FreeTrialRecord {
  const delta = Math.max(0, Math.floor(sessionMs))
  if (delta === 0) return record

  const now = Date.now()
  const usedMs = Math.min(FREE_SESSION_LIMIT_MS, record.usedMs + delta)
  return {
    ...record,
    usedMs,
    exhausted: usedMs >= FREE_SESSION_LIMIT_MS,
    lastUsedAt: now,
    firstUsedAt: record.firstUsedAt || now
  }
}

export function isFreeTrialTimeExpired(
  interviewStartedAt: number,
  usedMsBeforeInterview: number
): boolean {
  const elapsed = Date.now() - interviewStartedAt
  return usedMsBeforeInterview + elapsed >= FREE_SESSION_LIMIT_MS
}

export function freeTrialBlockedMessage(): string {
  return 'Your one-time 30-minute free trial on this device has ended. Subscribe at krakeninterview.com/pricing to continue interviewing.'
}

export function freeTrialSessionExpiredMessage(): string {
  return 'Your free trial time (30 minutes total per device) has ended. Subscribe at krakeninterview.com/pricing to continue interviewing.'
}
