import React from 'react';
import { useProducts } from '@/app/api/query/query';
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
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import Link from 'next/link';
import { useCategory } from '@/app/api/query/query';

const CategoryProducts = ({ categoryId }: { categoryId: number }) => {
  const { data: products, isLoading: productsLoading, error: productsError } = useProducts(categoryId);
  const { data: category, isLoading: categoryLoading } = useCategory(categoryId);

  if (productsLoading || categoryLoading) {
    return (
      <Container className="h-screen flex items-center justify-center">
        <Loader size="xl" />
      </Container>
    );
  }

  if (productsError) {
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
    );
  }

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="lg">
        {categoryId === 0 ? 'All Products' : category?.name}
      </Title>
      {products?.data.items.length === 0 ? (
        <Alert color="gray">
          No products found in this category.
        </Alert>
      ) : (
        <Grid>
          {products?.data.items.map((product) => (
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
      )}
    </Container>
  );
};

export default CategoryProducts;