import {
  getCartCount,
  getCartItems,
  isProductSlug,
} from '@/lib/cart'
import { loadOrCreateCartForVisitor, saveCart } from '@/lib/cart-store'
import { NextRequest, NextResponse } from 'next/server'

/** Returns the current cart count for the header badge. */
export async function GET() {
  try {
    const items = await getCartItems()

    return NextResponse.json({
      count: getCartCount(items),
      items: items.map((item) => ({
        slug: item.slug,
        qty: item.qty,
      })),
    })
  } catch (error) {
    console.error('Cart GET error:', error)
    return NextResponse.json({ error: 'Failed to get cart' }, { status: 500 })
  }
}

/** Adds one unit of a product to the cart. */
export async function POST(request: NextRequest) {
  try {
    const { productSlug } = await request.json()

    if (
      !productSlug ||
      typeof productSlug !== 'string' ||
      !isProductSlug(productSlug)
    ) {
      return NextResponse.json({ error: 'Invalid product slug' }, { status: 400 })
    }

    const { cartId, cart } = await loadOrCreateCartForVisitor()
    cart.items[productSlug] = (cart.items[productSlug] ?? 0) + 1
    await saveCart(cartId, cart)

    let count = 0
    const items = Object.entries(cart.items)
      .filter(([slug, qty]) => qty > 0 && isProductSlug(slug))
      .map(([slug, qty]) => {
        count += qty
        return { slug, qty }
      })

    return NextResponse.json({
      success: true,
      count,
      items,
    })
  } catch (error) {
    console.error('Cart API error:', error)
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 })
  }
}
