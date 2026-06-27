import {
  getCartCount,
  getCartItems,
  isProductSlug,
  isValidCartId,
} from '@/lib/cart'
import { emptyCart, loadCart, saveCart } from '@/lib/cart-store'
import { NextRequest, NextResponse } from 'next/server'

function invalidCartIdResponse() {
  return NextResponse.json({ error: 'Invalid cartId' }, { status: 400 })
}

/** Returns the current cart for the given cartId. */
export async function GET(request: NextRequest) {
  try {
    const cartId = request.nextUrl.searchParams.get('cartId')

    if (!cartId || !isValidCartId(cartId)) {
      return NextResponse.json(
        { error: 'Invalid or missing cartId' },
        { status: 400 },
      )
    }

    const items = await getCartItems(cartId)

    return NextResponse.json({
      cartId,
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

/** Adds one unit of a product to the cart identified by cartId. */
export async function POST(request: NextRequest) {
  try {
    const { cartId: requestedCartId, productSlug } = await request.json()

    if (
      !productSlug ||
      typeof productSlug !== 'string' ||
      !isProductSlug(productSlug)
    ) {
      return NextResponse.json({ error: 'Invalid product slug' }, { status: 400 })
    }

    let cartId: string

    if (requestedCartId === undefined || requestedCartId === null) {
      cartId = crypto.randomUUID()
    } else if (typeof requestedCartId !== 'string' || !isValidCartId(requestedCartId)) {
      return invalidCartIdResponse()
    } else {
      cartId = requestedCartId
    }

    const cart = (await loadCart(cartId)) ?? emptyCart()
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
      cartId,
      count,
      items,
    })
  } catch (error) {
    console.error('Cart API error:', error)
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 })
  }
}
