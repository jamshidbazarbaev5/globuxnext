'use client'
import React, { useMemo } from 'react'
import { useProducts } from '@/app/api/query/query'
import {
  Card,
  Image,
  Text,
  Badge,
  Group,
  Grid,
  Container,
  Title,
  Stack,
  Loader,
  Alert,
} from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import Link from 'next/link'
import { RootState } from '../redux/store'
import { useSelector } from 'react-redux'

 export const ProductList = () => {
  const { data, isLoading, error } = useProducts()
  const searchTerm = useSelector((state: RootState) => state.search.searchTerm)

  const filteredProducts = useMemo(() => {
    if (!data?.data.items || !searchTerm) {
      return data?.data.items
    }

    const searchLower = searchTerm.toLowerCase()
    return data.data.items.filter((product) =>
      product.name.toLowerCase().includes(searchLower)
    )
  }, [data?.data.items, searchTerm])

  if (isLoading) {
    return (
      <Container className="h-screen flex items-center justify-center">
        <Loader size="xl" />
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="h-screen flex items-center justify-center">
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error"
          color="red"
          variant="filled"
        >
          Failed to load products. Please try again later.
        </Alert>
      </Container>
    )
  }

  if (filteredProducts?.length === 0) {
    return (
      <Container size="xl" py="xl">
        <Title order={1} mb="lg">
          Products
        </Title>
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="No Results"
          color="gray"
          variant="light"
        >
          No products found matching "{searchTerm}"
        </Alert>
      </Container>
    )
  }

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="lg">
        Products
      </Title>
      <Grid>
        {filteredProducts?.map((product) => (
          <Grid.Col key={product.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
            <Link
              href={`/product/${product.id}`}
              style={{ textDecoration: 'none' }}
            >
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Card.Section>
                  <Image
                    src={product.images[0]?.image ?? ''}
                    height={200}
                    alt={product.name}
                    fit="cover"
                    loading="lazy"
                  />
                </Card.Section>

                <Stack mt="md" gap="sm">
                  <Group justify="space-between" align="flex-start">
                    <Text fw={500} lineClamp={2} style={{ flex: 1 }}>
                      {product.name}
                    </Text>
                    {product.is_new && (
                      <Badge color="green" variant="filled">
                        Новая
                      </Badge>
                    )}
                  </Group>

                  <Badge color="pink" variant="light">
                    {product.price.toLocaleString()} сум
                  </Badge>
                </Stack>
              </Card>
            </Link>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  )
}


