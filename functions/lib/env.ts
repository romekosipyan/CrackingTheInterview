export interface Env {
  STRIPE_SECRET_KEY: string
  STRIPE_WEBHOOK_SECRET: string
  STRIPE_PRICE_WEEKLY: string
  STRIPE_PRICE_MONTHLY: string
  STRIPE_PRICE_LIFETIME: string
  /** Live coupon id for launch promos (e.g. LAUNCH10) when promotion codes are not yet created. */
  STRIPE_PROMO_COUPON_ID?: string
  WEBSITE_ORIGIN: string
  APP_LATEST_VERSION?: string
  INSTALLERS: R2Bucket
  DEVICES: KVNamespace
}

export function publicOrigin(request: Request): string {
  return new URL(request.url).origin
}

export function websiteOrigin(env: Env): string {
  return env.WEBSITE_ORIGIN ?? 'http://localhost:5174'
}
