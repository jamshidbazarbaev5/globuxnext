'use client'

import { Suspense } from 'react'
import Product from "@/app/components/ProductDetails"
import ProductSkeleton from './ProductSkeleton'

export default function ProductPage({ params }: { params: { id: string } }) {
  const productId = Number(params.id)

  return (
    <Suspense fallback={<ProductSkeleton />}>
      <Product productId={productId} />
    </Suspense>
  )
}