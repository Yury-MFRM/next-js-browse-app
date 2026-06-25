import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { buttonVariants } from "@/components/ui/button"

export default function CartPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-balance text-3xl font-semibold tracking-tight">
          Your cart
        </h1>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          {"Cart handling isn't implemented in this project."}
        </p>
        <Link href="/" className={buttonVariants({ className: "mt-6" })}>
          Continue shopping
        </Link>
      </section>
    </main>
  )
}
