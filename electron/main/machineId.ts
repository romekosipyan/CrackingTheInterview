import { randomUUID } from 'node:crypto'
import os from 'node:os'
import Store from 'electron-store'

const machineStore = new Store<{ machineId: string }>({
  name: 'kraken-machine'
})

export function getMachineId(): string {
  let machineId = machineStore.get('machineId')
  if (!machineId) {
    machineId = randomUUID()
    machineStore.set('machineId', machineId)
  }
  return machineId
}

export function getMachineName(): string {
  return os.hostname()
}
