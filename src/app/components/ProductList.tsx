import React, { useState, useCallback } from "react";
import {
  Card,
  Text,
  Badge,
  Group,
  Grid,
  Container,
  Title,
  Stack,
  Alert,
  Loader,
  Box,
  Image,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { RootState } from "../redux/store";
import { useProducts } from "../api/query/query";
import { debounce } from 'lodash';
import dynamic from "next/dynamic";

const DynamicPagination = dynamic(
  () => import("@mantine/core").then((mod) => mod.Pagination),
  { loading: () => <p>Loading...</p>, ssr: false }
);

export const ProductList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemsPerPage = 12;
  
  const categoryId = searchParams.get("category") 
    ? parseInt(searchParams.get("category")!, 10) 
    : undefined;

  const searchTerm = useSelector((state: RootState) => state.search.searchTerm);
  
  const [page, setPage] = useState(parseInt(searchParams.get("page") ?? "1", 10));

  React.useEffect(() => {
    setPage(1);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  }, [searchTerm, categoryId]);

  const { data, isLoading, error, isFetching } = useProducts(
    categoryId,
    page,
    itemsPerPage,
    searchTerm 
    );

  const products = data?.items || [];
  const totalPages = data?.totalPages || 1;

  const debouncedHandlePageChange = useCallback(
    debounce((newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", newPage.toString());
      router.push(`?${params.toString()}`, { scroll: false });
    }, 300),
    [searchParams, router]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      debouncedHandlePageChange(newPage);
    },
    [debouncedHandlePageChange]
  );

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

  if (products.length === 0) {
    return (
      <Container size="xl" py="xl">
        <Title order={1} mb="lg">
          Products
          {searchTerm && ` - Search results for "${searchTerm}"`}
          {categoryId && ` - Category ${categoryId}`}
        </Title>
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
      <Title order={1} mb="lg">
        Products
        {searchTerm && ` - Search results for "${searchTerm}"`}
        {categoryId && ` - Category ${categoryId}`}
      </Title>

      {isFetching && (
        <Box className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
          <Loader size="sm" />
        </Box>
      )}

      <Grid>
        {products.map((product) => (
          <Grid.Col key={product.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
            <Link
              href={`/product/${product.id}`}
              style={{ textDecoration: "none" }}
            >
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Card.Section>
                  <Image
                    src={product.images[0]?.image ?? ""}
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

      {totalPages > 1 && (
        <Stack align="center" mt="xl" gap="xs">
          <DynamicPagination
            value={page}
            onChange={handlePageChange}
            total={totalPages}
            color="blue"
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