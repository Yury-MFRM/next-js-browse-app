import { loadCartForVisitor } from '@/lib/cart-store'
import { getProduct } from '@/lib/products'

export type CartItem = {
  slug: string
  qty: number
  product: NonNullable<ReturnType<typeof getProduct>>
}

/** Loads cart line items from Upstash Redis using the `cart_id` cookie. */
export async function getCartItems(): Promise<CartItem[]> {
  const { cart } = await loadCartForVisitor()

  return Object.entries(cart.items)
    .filter(([, qty]) => qty > 0)
    .flatMap(([slug, qty]) => {
      const product = getProduct(slug)
      if (!product) return []
      return [{ slug, qty, product }]
    })
}

export function getCartCount(items: Array<{ qty: number }>): number {
  return items.reduce((sum, item) => sum + item.qty, 0)
}

export function isProductSlug(slug: string): boolean {
  return getProduct(slug) !== undefined
}
