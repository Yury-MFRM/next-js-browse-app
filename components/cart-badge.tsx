'use client'

import { useCallback, useEffect, useState } from 'react'
import { getClientCartId } from '@/lib/cart-id'

export function CartBadge() {
  const [cartCount, setCartCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  const fetchCartCount = useCallback(async () => {
    const cartId = getClientCartId()
    if (!cartId) {
      setCartCount(0)
      return
    }

    try {
      const response = await fetch(
        `/api/cart?cartId=${encodeURIComponent(cartId)}`,
      )
      if (response.ok) {
        const data = await response.json()
        setCartCount(data.count)
      }
    } catch (error) {
      console.error('Error fetching cart count:', error)
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    void fetchCartCount()
  }, [fetchCartCount])
  // Only render on client after hydration to prevent flashing
  if (!mounted) {
    return null
  }

  if (cartCount === 0) {
    return null
  }

  return (
    <span
      className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white"
      aria-label={`${cartCount} items in cart`}
    >
      {cartCount}
    </span>
  )
}
