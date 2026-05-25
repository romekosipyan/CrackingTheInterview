import type { SubscriptionPlanId } from './subscriptionPlans'
import type { InterviewSessionStartConfig } from './types'
import { isNonCodingLanguage, isSystemDesignSession } from './types'

export const FREE_SESSION_LIMIT_MS = 30 * 60 * 1000

export type PlanEntitlements = {
  maxSessionMs: number | null
  jdResumeContext: boolean
  systemDesignDiagrams: boolean
  generalNoCodeInterviews: boolean
}

export const PLAN_ENTITLEMENTS: Record<SubscriptionPlanId, PlanEntitlements> = {
  free: {
    maxSessionMs: FREE_SESSION_LIMIT_MS,
    jdResumeContext: false,
    systemDesignDiagrams: false,
    generalNoCodeInterviews: false
  },
  weekly: {
    maxSessionMs: null,
    jdResumeContext: false,
    systemDesignDiagrams: false,
    generalNoCodeInterviews: false
  },
  monthly: {
    maxSessionMs: null,
    jdResumeContext: true,
    systemDesignDiagrams: true,
    generalNoCodeInterviews: true
  },
  lifetime: {
    maxSessionMs: null,
    jdResumeContext: true,
    systemDesignDiagrams: true,
    generalNoCodeInterviews: true
  }
}

const PLAN_TIER_ORDER: SubscriptionPlanId[] = ['lifetime', 'monthly', 'weekly', 'free']

export function resolveEffectivePlanId(planIds: SubscriptionPlanId[]): SubscriptionPlanId {
  for (const tier of PLAN_TIER_ORDER) {
    if (planIds.includes(tier)) return tier
  }
  return 'free'
}

export function getEntitlements(planId: SubscriptionPlanId): PlanEntitlements {
  return PLAN_ENTITLEMENTS[planId]
}

export function sessionElapsedMs(startedAt: number): number {
  return Date.now() - startedAt
}

export function isSessionTimeExpired(startedAt: number, planId: SubscriptionPlanId): boolean {
  const limit = getEntitlements(planId).maxSessionMs
  if (limit === null) return false
  return sessionElapsedMs(startedAt) >= limit
}

export function formatSessionTimeRemaining(startedAt: number, planId: SubscriptionPlanId): string {
  const limit = getEntitlements(planId).maxSessionMs
  if (limit === null) return ''
  const remainingMs = Math.max(0, limit - sessionElapsedMs(startedAt))
  const minutes = Math.ceil(remainingMs / 60_000)
  return `${minutes} min`
}

export function validateSessionStart(
  planId: SubscriptionPlanId,
  config: InterviewSessionStartConfig
): { allowed: boolean; reason?: string } {
  const entitlements = getEntitlements(planId)

  if (isNonCodingLanguage(config.programmingLanguage) && !entitlements.generalNoCodeInterviews) {
    return {
      allowed: false,
      reason:
        planId === 'free'
          ? 'General and no-code interviews require a paid plan. Subscribe at krakeninterview.com/pricing — Pro Monthly unlocks all interview types.'
          : 'General and no-code interviews require Pro Monthly or Lifetime. Upgrade at krakeninterview.com/pricing.'
    }
  }

  if (config.jobDescriptionUrl?.trim() && !entitlements.jdResumeContext) {
    return {
      allowed: false,
      reason:
        planId === 'free'
          ? 'Job description context requires a paid plan. Subscribe at krakeninterview.com/pricing — Pro Monthly unlocks JD + resume context.'
          : 'Job description context requires Pro Monthly or Lifetime. Upgrade at krakeninterview.com/pricing.'
    }
  }

  if (
    isSystemDesignSession(config) &&
    !entitlements.systemDesignDiagrams
  ) {
    return {
      allowed: false,
      reason:
        planId === 'free'
          ? 'System design interviews require a paid plan. Subscribe at krakeninterview.com/pricing — Pro Monthly unlocks system design with diagrams.'
          : 'System design with diagrams requires Pro Monthly or Lifetime. Upgrade at krakeninterview.com/pricing.'
    }
  }

  return { allowed: true }
}

export function validateResumeUpload(planId: SubscriptionPlanId): { allowed: boolean; reason?: string } {
  if (getEntitlements(planId).jdResumeContext) {
    return { allowed: true }
  }

  return {
    allowed: false,
    reason:
      planId === 'free'
        ? 'Resume context requires a paid plan. Subscribe at krakeninterview.com/pricing — Pro Monthly unlocks JD + resume context.'
        : 'Resume context requires Pro Monthly or Lifetime. Upgrade at krakeninterview.com/pricing.'
  }
}

export function freeSessionExpiredMessage(): string {
  return 'Your free session limit (30 minutes) has ended. Subscribe at krakeninterview.com/pricing to continue interviewing.'
}
