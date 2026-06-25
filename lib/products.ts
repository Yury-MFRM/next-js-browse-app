export type Product = {
  slug: string
  name: string
  price: string
  image: string
  description: string
}

export const products: Product[] = [
  {
    slug: "headphones",
    name: "Wireless Headphones",
    price: "$199",
    image: "/products/headphones.png",
    description:
      "Premium over-ear wireless headphones with active noise cancellation and up to 30 hours of battery life.",
  },
  {
    slug: "sneakers",
    name: "Everyday Sneakers",
    price: "$120",
    image: "/products/sneakers.png",
    description:
      "Minimalist white sneakers crafted with breathable materials and a cushioned sole for all-day comfort.",
  },
  {
    slug: "watch",
    name: "Classic Watch",
    price: "$249",
    image: "/products/watch.png",
    description:
      "A sleek analog wristwatch with a genuine leather strap and a timeless, understated design.",
  },
  {
    slug: "backpack",
    name: "Canvas Backpack",
    price: "$89",
    image: "/products/backpack.png",
    description:
      "A durable olive canvas backpack with a padded laptop compartment and plenty of organized storage.",
  },
]

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}
