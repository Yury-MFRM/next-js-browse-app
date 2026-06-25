'use client'

import { useEffect, useState } from 'react'

export function CartBadge() {
  const [cartCount, setCartCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Fetch initial cart count (total quantity across all items)
    const fetchCartCount = async () => {
      try {
        const response = await fetch('/api/cart', { method: 'GET' })
        if (response.ok) {
          const data = await response.json()
          // count already includes sum of all quantities from API
          setCartCount(data.count)
        }
      } catch (error) {
        console.error('Error fetching cart count:', error)
      }
    }

    fetchCartCount()

    // Listen for storage changes (when cart is updated in another tab/window)
    const handleStorageChange = () => {
      fetchCartCount()
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

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
