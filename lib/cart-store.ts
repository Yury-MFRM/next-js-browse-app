import { Redis } from '@upstash/redis'
import { cookies } from 'next/headers'
import { CART_ID_COOKIE } from '@/lib/cart-id'

const CART_KEY_PREFIX = 'cart:'
const CART_TTL_SECONDS = 60 * 60 * 24 * 7

export type CartRecord = {
  items: Record<string, number>
  progress: number
}

export const emptyCart = (): CartRecord => ({ items: {}, progress: 0 })

/** In-memory fallback when Redis env vars are not configured (local dev). */
const memoryStore = new Map<string, CartRecord>()

function getRedis(): Redis | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

function cartKey(cartId: string): string {
  return `${CART_KEY_PREFIX}${cartId}`
}

export async function getCartId(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(CART_ID_COOKIE)?.value ?? null
}

export async function loadCart(cartId: string): Promise<CartRecord | null> {
  const redis = getRedis()
  if (redis) {
    return (await redis.get<CartRecord>(cartKey(cartId))) ?? null
  }
  return memoryStore.get(cartId) ?? null
}

export async function saveCart(
  cartId: string,
  cart: CartRecord,
): Promise<void> {
  const redis = getRedis()
  if (redis) {
    await redis.set(cartKey(cartId), cart, { ex: CART_TTL_SECONDS })
    return
  }
  memoryStore.set(cartId, cart)
}
