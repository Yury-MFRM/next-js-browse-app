import { emptyCart, getCartId, loadCart } from '@/lib/cart-store'
import { getProduct } from '@/lib/products'

export type CartItem = {
  slug: string
  qty: number
  product: NonNullable<ReturnType<typeof getProduct>>
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function isValidCartId(cartId: string): boolean {
  return UUID_RE.test(cartId)
}

export async function getCartItems(cartId: string): Promise<CartItem[]> {
  const cart = (await loadCart(cartId)) ?? emptyCart()

  return Object.entries(cart.items)
    .filter(([, qty]) => qty > 0)
    .flatMap(([slug, qty]) => {
      const product = getProduct(slug)
      if (!product) return []
      return [{ slug, qty, product }]
    })
}

/** Loads cart items for the current visitor using the `cart_id` cookie. */
export async function getCartItemsForVisitor(): Promise<CartItem[]> {
  const cartId = await getCartId()
  if (!cartId) return []
  return getCartItems(cartId)
}

export function getCartCount(items: Array<{ qty: number }>): number {
  return items.reduce((sum, item) => sum + item.qty, 0)
}

export function isProductSlug(slug: string): boolean {
  return getProduct(slug) !== undefined
}
