import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

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
    const cartItems = cookieStore.get('cart_items')?.value || ''

    // Parse existing items
    const items = cartItems
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)

    // Add product if not already in cart (no duplicates)
    if (!items.includes(productName)) {
      items.push(productName)
    }

    // Update cookie with new items
    const newCartValue = items.join(',')
    cookieStore.set('cart_items', newCartValue, {
      httpOnly: false, // Allow client-side access for badge display
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({
      success: true,
      count: items.length,
      items: items,
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
    const cartItems = cookieStore.get('cart_items')?.value || ''

    const items = cartItems
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)

    return NextResponse.json({
      items: items,
      count: items.length,
    })
  } catch (error) {
    console.error('Cart GET error:', error)
    return NextResponse.json(
      { error: 'Failed to get cart' },
      { status: 500 }
    )
  }
}
