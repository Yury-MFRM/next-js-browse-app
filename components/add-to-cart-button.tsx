'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'

interface AddToCartButtonProps {
  productSlug: string
  className?: string
}

export function AddToCartButton({
  productSlug,
  className,
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAddToCart = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productSlug }),
      })

      if (!response.ok) {
        throw new Error('Failed to add to cart')
      }

      // Redirect after successful addition
      router.push('/cart')
    } catch (error) {
      console.error('Error adding to cart:', error)
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading}
      className={buttonVariants({
        size: 'lg',
        className: `mt-2 w-full sm:w-auto ${className || ''}`,
      })}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          Adding...
        </>
      ) : (
        'Add to cart'
      )}
    </button>
  )
}
