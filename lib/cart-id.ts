export const CART_ID_COOKIE = 'cart_id'

const CART_ID_MAX_AGE_SECONDS = 60 * 60 * 24 * 7

export function getClientCartId(): string | null {
  if (typeof document === 'undefined') return null

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${CART_ID_COOKIE}=([^;]*)`),
  )
  return match ? decodeURIComponent(match[1]) : null
}

export function setClientCartId(cartId: string): void {
  document.cookie = `${CART_ID_COOKIE}=${encodeURIComponent(cartId)}; path=/; max-age=${CART_ID_MAX_AGE_SECONDS}; samesite=lax`
}
