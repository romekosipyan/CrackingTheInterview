import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  normalizeSubscriptionEmail,
  removeDevice,
  type RegisteredDevice
} from '../../shared/deviceRegistration.js'

const DATA_DIR = join(process.cwd(), '.data')
const STORE_PATH = join(DATA_DIR, 'devices.json')

type DeviceStore = Record<string, RegisteredDevice[]>

function ensureStore(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true })
  }
  if (!existsSync(STORE_PATH)) {
    writeFileSync(STORE_PATH, JSON.stringify({}), 'utf8')
  }
}

function loadStore(): DeviceStore {
  ensureStore()
  try {
    const parsed = JSON.parse(readFileSync(STORE_PATH, 'utf8')) as DeviceStore
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function saveStore(store: DeviceStore): void {
  ensureStore()
  writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf8')
}

export async function loadRegisteredDevices(email: string): Promise<RegisteredDevice[]> {
  const store = loadStore()
  return store[normalizeSubscriptionEmail(email)] ?? []
}

export async function saveRegisteredDevices(
  email: string,
  devices: RegisteredDevice[]
): Promise<void> {
  const store = loadStore()
  store[normalizeSubscriptionEmail(email)] = devices
  saveStore(store)
}

export async function removeRegisteredDevice(
  email: string,
  machineId: string
): Promise<{ devices: RegisteredDevice[]; removed: boolean }> {
  const devices = await loadRegisteredDevices(email)
  const result = removeDevice(devices, machineId)
  if (result.removed) {
    await saveRegisteredDevices(email, result.devices)
  }
  return result
}
