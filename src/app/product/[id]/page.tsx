'use client'

import { Suspense, lazy } from 'react'
import ProductSkeleton from './ProductSkeleton'

const Product = lazy(() => import("@/app/components/ProductDetails"))


export default function ProductPage({ params }: { params: { id: string } }) {
  const productId = Number(params.id)

  return (
    <>
      <Suspense fallback={<ProductSkeleton />}>
        <Product productId={productId} />
      </Suspense>

     
    </>
  )
}