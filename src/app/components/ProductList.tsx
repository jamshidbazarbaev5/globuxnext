import React, { useMemo } from 'react';
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
  Alert,
  Loader,
  Pagination,
  Box,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { RootState } from '../redux/store';
import { IProduct } from '../models/models';
import { useProducts } from '../api/query/query';
import { useCallback } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import components that are not needed immediately
const DynamicPagination = dynamic(() => import('@mantine/core').then((mod) => mod.Pagination), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export const ProductList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemsPerPage = 12;
  
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  
  // Fetch products with pagination
  const { data, isLoading, error, isFetching } = useProducts(undefined, page, itemsPerPage);
  const searchTerm = useSelector((state: RootState) => state.search.searchTerm);

  const products = data?.items || [];
  const totalPages = data?.totalPages || 1;

  const handlePageChange = useCallback((newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const filteredProducts = useMemo(() => {
    if (!products || !searchTerm) {
      return products;
    }

    const searchLower = searchTerm.toLowerCase();
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchLower)
    );
  }, [products, searchTerm]);

  if (isLoading) {
    return (
      <Container className="min-h-[50vh] flex items-center justify-center">
        <Loader size="xl" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="min-h-[50vh] flex items-center justify-center">
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

  if (filteredProducts.length === 0) {
    return (
      <Container size="xl" py="xl">
        <Title order={1} mb="lg">Products</Title>
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="No Results"
          color="gray"
          variant="light"
        >
          {searchTerm 
            ? `No products found matching "${searchTerm}"`
            : "No products available at the moment."}
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="lg">Products</Title>
      
      {isFetching && (
        <Box className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
          <Loader size="sm" />
        </Box>
      )}

      <Grid>
        {filteredProducts.map((product) => (
          <Grid.Col key={product.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
            <Link
              href={`/product/${product.id}`}
              className="block h-full no-underline"
            >
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                className="h-full flex flex-col"
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

                <Stack mt="md" gap="sm" className="flex-grow">
                  <Group justify="space-between" align="flex-start">
                    <Text fw={500} lineClamp={2} className="flex-grow">
                      {product.name}
                    </Text>
                    {product.is_new && (
                      <Badge color="green" variant="filled">
                        Новая
                      </Badge>
                    )}
                  </Group>

                  <Badge color="pink" variant="light" className="mt-auto">
                    {product.price.toLocaleString()} сум
                  </Badge>
                </Stack>
              </Card>
            </Link>
          </Grid.Col>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Stack align="center" mt="xl" gap="xs">
          <DynamicPagination
            value={page}
            onChange={handlePageChange}
            total={totalPages}
            color="pink"
            radius="md"
            withEdges
            className="sticky bottom-4"
          />
          <Text size="sm" c="dimmed">
            Page {page} of {totalPages}
          </Text>
        </Stack>
      )}
    </Container>
  );
};

export default ProductList;