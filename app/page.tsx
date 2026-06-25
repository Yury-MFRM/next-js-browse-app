import Link from "next/link"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { products } from "@/lib/products"

export default function StorefrontPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-balance text-3xl font-semibold tracking-tight">
          Shop our collection
        </h1>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Tap any product to view its details.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/${product.slug}`}
              className="group flex flex-col gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent"
            >
              <div className="aspect-square overflow-hidden rounded-md bg-muted">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{product.name}</span>
                <span className="text-sm text-muted-foreground">{product.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
