import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { buttonVariants } from "@/components/ui/button"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { getProduct, products } from "@/lib/products"

export function generateStaticParams() {
  return products.map((product) => ({ productName: product.slug }))
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productName: string }>
}) {
  const { productName } = await params
  const product = getProduct(productName)

  if (!product) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-4 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to store
        </Link>

        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-lg bg-muted">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={600}
              height={600}
              className="h-full w-full object-cover"
              priority
            />
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-balance text-3xl font-semibold tracking-tight">
              {product.name}
            </h1>
            <p className="text-2xl font-medium">{product.price}</p>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              {product.description}
            </p>
            <AddToCartButton productName={product.name} />
          </div>
        </div>
      </section>
    </main>
  )
}
