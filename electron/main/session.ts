import { randomUUID } from 'crypto'
import type { InterviewSession } from '../../shared/types'

let activeSession: InterviewSession | null = null

export function getActiveSession(): InterviewSession | null {
  return activeSession
}

export function startSession(
  config: Omit<InterviewSession, 'sessionId' | 'startedAt'>
): InterviewSession {
  activeSession = {
    ...config,
    sessionId: randomUUID(),
    startedAt: Date.now()
  }
  return activeSession
}

export function newSessionFromActive(): InterviewSession | null {
  if (!activeSession) return null
  activeSession = {
    ...activeSession,
    sessionId: randomUUID(),
    startedAt: Date.now()
  }
  return activeSession
}

export function endSession(): void {
  activeSession = null
}
