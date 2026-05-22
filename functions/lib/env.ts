export interface Env {
  STRIPE_SECRET_KEY: string
  STRIPE_WEBHOOK_SECRET: string
  STRIPE_PRICE_WEEKLY: string
  STRIPE_PRICE_MONTHLY: string
  STRIPE_PRICE_LIFETIME: string
  WEBSITE_ORIGIN: string
  INSTALLERS: R2Bucket
  DEVICES: KVNamespace
}

export function publicOrigin(request: Request): string {
  return new URL(request.url).origin
}

export function websiteOrigin(env: Env): string {
  return env.WEBSITE_ORIGIN ?? 'http://localhost:5174'
}
