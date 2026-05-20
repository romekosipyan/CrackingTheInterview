import { randomUUID } from 'crypto'
import Store from 'electron-store'
import type { RoleCard } from '../../shared/types'

const store = new Store<{ roles: RoleCard[] }>({
  defaults: { roles: [] }
})

export function listRoles(): RoleCard[] {
  return store.get('roles')
}

export function addRole(role: Omit<RoleCard, 'id'>): RoleCard {
  const next: RoleCard = { ...role, id: randomUUID() }
  const roles = [...listRoles(), next]
  store.set('roles', roles)
  return next
}

export function removeRole(id: string): RoleCard[] {
  const roles = listRoles().filter((role) => role.id !== id)
  store.set('roles', roles)
  return roles
}

export function getRole(id: string): RoleCard | undefined {
  return listRoles().find((role) => role.id === id)
}
