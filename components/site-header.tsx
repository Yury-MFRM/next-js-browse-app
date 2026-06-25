import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { CartBadge } from "@/components/cart-badge"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Browse
        </Link>
        <Link
          href="/cart"
          aria-label="View cart"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <ShoppingCart className="h-5 w-5" aria-hidden="true" />
          <CartBadge />
        </Link>
      </div>
    </header>
  )
}
