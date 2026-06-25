import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// Parse cart string "name:qty,name:qty,..." into a map
function parseCartItems(cartString: string): Map<string, number> {
  const items = new Map<string, number>()
  if (!cartString.trim()) return items

  const entries = cartString
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)

  entries.forEach((entry) => {
    const [name, qtyStr] = entry.split(':')
    const qty = qtyStr ? parseInt(qtyStr, 10) : 1
    items.set(name, qty)
  })

  return items
}

// Convert map to cart string, omitting :1 for single quantities
function serializeCartItems(items: Map<string, number>): string {
  const entries: string[] = []
  items.forEach((qty, name) => {
    entries.push(qty === 1 ? name : `${name}:${qty}`)
  })
  return entries.join(',')
}

// Calculate total item count (sum of all quantities)
function calculateTotalCount(items: Map<string, number>): number {
  let total = 0
  items.forEach((qty) => {
    total += qty
  })
  return total
}

export async function POST(request: NextRequest) {
  try {
    const { productName } = await request.json()

    if (!productName || typeof productName !== 'string') {
      return NextResponse.json(
        { error: 'Invalid product name' },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
    const cartItemsString = cookieStore.get('cart_items')?.value || ''

    // Parse existing items
    const items = parseCartItems(cartItemsString)

    // Increment quantity if product exists, otherwise add with qty 1
    const currentQty = items.get(productName) || 0
    items.set(productName, currentQty + 1)

    // Update cookie with new items
    const newCartValue = serializeCartItems(items)
    cookieStore.set('cart_items', newCartValue, {
      httpOnly: false, // Allow client-side access for badge display
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    const totalCount = calculateTotalCount(items)

    return NextResponse.json({
      success: true,
      count: totalCount,
      items: Array.from(items.entries()).map(([name, qty]) => ({
        name,
        qty,
      })),
    })
  } catch (error) {
    console.error('Cart API error:', error)
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const cartItemsString = cookieStore.get('cart_items')?.value || ''

    const items = parseCartItems(cartItemsString)
    const totalCount = calculateTotalCount(items)

    return NextResponse.json({
      items: Array.from(items.entries()).map(([name, qty]) => ({
        name,
        qty,
      })),
      count: totalCount,
    })
  } catch (error) {
    console.error('Cart GET error:', error)
    return NextResponse.json(
      { error: 'Failed to get cart' },
      { status: 500 }
    )
  }
}
