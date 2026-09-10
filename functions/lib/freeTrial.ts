import {
  applyFreeTrialUsage,
  emptyFreeTrialRecord,
  freeTrialKey,
  toFreeTrialStatus,
  type FreeTrialRecord,
  type FreeTrialStatus
} from '../../shared/freeTrial'
import type { Env } from './env'
import { recordEvent } from './events'

async function loadFreeTrialRecord(env: Env, machineId: string): Promise<FreeTrialRecord | null> {
  const raw = await env.DEVICES.get(freeTrialKey(machineId))
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as FreeTrialRecord
    if (!parsed || typeof parsed !== 'object' || !parsed.machineId) return null
    return parsed
  } catch {
    return null
  }
}

async function saveFreeTrialRecord(env: Env, record: FreeTrialRecord): Promise<void> {
  await env.DEVICES.put(freeTrialKey(record.machineId), JSON.stringify(record))
}

export async function getFreeTrialStatus(env: Env, machineId: string): Promise<FreeTrialStatus> {
  const trimmedId = machineId.trim()
  if (!trimmedId) {
    throw new Error('Machine ID is required.')
  }
  const record = (await loadFreeTrialRecord(env, trimmedId)) ?? emptyFreeTrialRecord(trimmedId)
  return toFreeTrialStatus(record)
}

export async function consumeFreeTrialSession(
  env: Env,
  machineId: string,
  sessionMs: number
): Promise<FreeTrialStatus> {
  const trimmedId = machineId.trim()
  if (!trimmedId) {
    throw new Error('Machine ID is required.')
  }

  const stored = await loadFreeTrialRecord(env, trimmedId)
  const existing = stored ?? emptyFreeTrialRecord(trimmedId)
  const updated = applyFreeTrialUsage(existing, sessionMs)
  await saveFreeTrialRecord(env, updated)
  if (!stored) {
    await recordEvent(env, 'trial_started', 'app')
  }
  return toFreeTrialStatus(updated)
}

/** @deprecated Use consumeFreeTrialSession — kept for legacy /api/free-trial/sync route. */
export async function syncFreeTrialUsage(
  env: Env,
  machineId: string,
  addMs: number
): Promise<FreeTrialStatus> {
  return consumeFreeTrialSession(env, machineId, addMs)
}
