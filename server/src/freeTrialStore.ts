import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  applyFreeTrialUsage,
  emptyFreeTrialRecord,
  freeTrialKey,
  toFreeTrialStatus,
  type FreeTrialRecord,
  type FreeTrialStatus
} from '../../shared/freeTrial.js'

const DATA_DIR = join(process.cwd(), '.data')
const STORE_PATH = join(DATA_DIR, 'free-trials.json')

type FreeTrialStore = Record<string, FreeTrialRecord>

function ensureStore(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true })
  }
  if (!existsSync(STORE_PATH)) {
    writeFileSync(STORE_PATH, JSON.stringify({}), 'utf8')
  }
}

function loadStore(): FreeTrialStore {
  ensureStore()
  try {
    const parsed = JSON.parse(readFileSync(STORE_PATH, 'utf8')) as FreeTrialStore
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function saveStore(store: FreeTrialStore): void {
  ensureStore()
  writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf8')
}

function loadFreeTrialRecord(machineId: string): FreeTrialRecord | null {
  const store = loadStore()
  return store[freeTrialKey(machineId)] ?? null
}

function saveFreeTrialRecord(record: FreeTrialRecord): void {
  const store = loadStore()
  store[freeTrialKey(record.machineId)] = record
  saveStore(store)
}

export async function getFreeTrialStatus(machineId: string): Promise<FreeTrialStatus> {
  const trimmedId = machineId.trim()
  if (!trimmedId) {
    throw new Error('Machine ID is required.')
  }
  const record = loadFreeTrialRecord(trimmedId) ?? emptyFreeTrialRecord(trimmedId)
  return toFreeTrialStatus(record)
}

export async function consumeFreeTrialSession(
  machineId: string,
  sessionMs: number
): Promise<FreeTrialStatus> {
  const trimmedId = machineId.trim()
  if (!trimmedId) {
    throw new Error('Machine ID is required.')
  }

  const existing = loadFreeTrialRecord(trimmedId) ?? emptyFreeTrialRecord(trimmedId)
  const updated = applyFreeTrialUsage(existing, sessionMs)
  saveFreeTrialRecord(updated)
  return toFreeTrialStatus(updated)
}

/** @deprecated Use consumeFreeTrialSession — kept for legacy /api/free-trial/sync route. */
export async function syncFreeTrialUsage(machineId: string, addMs: number): Promise<FreeTrialStatus> {
  return consumeFreeTrialSession(machineId, addMs)
}
