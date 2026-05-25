import { randomUUID } from 'node:crypto'
import os from 'node:os'
import Store from 'electron-store'

const machineStore = new Store<{ machineId: string }>({
  name: 'kraken-machine'
})

function platformLabel(): string {
  switch (process.platform) {
    case 'win32':
      return 'Windows PC'
    case 'darwin':
      return 'Mac'
    case 'linux':
      return 'Linux PC'
    default:
      return 'Device'
  }
}

export function getMachineId(): string {
  let machineId = machineStore.get('machineId')
  if (!machineId) {
    machineId = randomUUID()
    machineStore.set('machineId', machineId)
  }
  return machineId
}

export function getMachineName(): string {
  const host = os.hostname().trim()
  const label = platformLabel()
  return host ? `${host} (${label})` : label
}
