'use client'

import {ProductList} from '@/app/components/ProductList'
import  CategoryList  from '../components/CategoryList'
import { Container, Grid } from '@mantine/core'

export default function ProductsPage() {
  return (
    <Container size="xl" py="xl">
      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 3 }}>
          <CategoryList  />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 9 }}>
          <ProductList />
        </Grid.Col>
      </Grid>
    </Container>
  )
}
