'use client'

import dynamic from 'next/dynamic'
import { Container, Grid } from '@mantine/core'
import { useCategories } from '../api/query/query'
import { Suspense } from 'react'
import { Loader } from '@mantine/core'

const ProductList = dynamic(
  () => import('@/app/components/ProductList').then(mod => ({ default: mod.ProductList })),
  {
    loading: () => <Loader />,
    ssr: false
  }
)

const CategoryList = dynamic(
  () => import('../components/CategoryList'),
  {
    loading: () => <Loader />,
    ssr: false
  }
)

export default function ProductsPage() {
  const { data: categories } = useCategories()

  return (
    <Container size="xl" py="xl">
      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Suspense fallback={<Loader />}>
            <CategoryList initialCategories={categories ?? []} />
          </Suspense>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 9 }}>
          <Suspense fallback={<Loader />}>
            <ProductList />
          </Suspense>
        </Grid.Col>
      </Grid>
    </Container>
  )
}
