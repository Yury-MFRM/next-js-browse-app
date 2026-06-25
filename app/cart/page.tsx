import Link from "next/link"
import { cookies } from "next/headers"
import { SiteHeader } from "@/components/site-header"
import { buttonVariants } from "@/components/ui/button"
import { getProduct, products } from "@/lib/products"

export default async function CartPage() {
  const cookieStore = await cookies()
  const cartItemsString = cookieStore.get("cart_items")?.value || ""
  
  const cartItemNames = cartItemsString
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
  
  // Find product details for items in cart
  const cartProducts = cartItemNames
    .map((name) => products.find((p) => p.name === name))
    .filter((p) => p !== undefined)

  const total = cartProducts.reduce((sum, product) => {
    const price = parseFloat(product.price.replace("$", ""))
    return sum + price
  }, 0)

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-balance text-3xl font-semibold tracking-tight">
          Your cart
        </h1>
        
        {cartProducts.length === 0 ? (
          <>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              Your cart is empty.
            </p>
            <Link href="/" className={buttonVariants({ className: "mt-6" })}>
              Continue shopping
            </Link>
          </>
        ) : (
          <>
            <div className="mt-8 space-y-4">
              {cartProducts.map((product) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between border-b border-border py-4"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {product.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-semibold">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
            
            <div className="mt-6 flex gap-4">
              <Link href="/" className={buttonVariants({ variant: "outline" })}>
                Continue shopping
              </Link>
              <button
                className={buttonVariants()}
                disabled
              >
                Proceed to checkout (coming soon)
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  )
}
