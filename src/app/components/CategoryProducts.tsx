import React from "react";
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
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import Link from "next/link";
import { IProduct, ICategory } from "@/app/models/models";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { api } from "@/app/api/axios/axios";

export const getStaticPaths = async () => {
  const response = await api.get('/categories');
  const categories = response.data.data.categories;

  const paths = categories.map((category: ICategory) => ({
    params: { categoryId: category.id.toString() },
  }));

  paths.push({ params: { categoryId: '0' } }); 
  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps<{
  products: IProduct[];
  category: ICategory | null;
}> = async ({ params }) => {
  const categoryId = params?.categoryId as string;
  try {
    const [productsRes, categoryRes] = await Promise.all([
      api.get(`/products${categoryId !== "0" ? `?category=${categoryId}` : ""}`),
      categoryId !== "0" ? api.get(`/categories/${categoryId}`) : null,
    ]);

    return {
      props: {
        products: productsRes.data.data.items,
        category: categoryRes ? categoryRes.data.data : null,
      },
      revalidate: 60 * 60, 
    };
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return { props: { products: [], category: null }, revalidate: 60 };
  }
};

const CategoryProducts = ({
  products,
  category,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  if (!products) {
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
        {!category ? "All Products" : category.name}
      </Title>
      {products.length === 0 ? (
        <Alert color="gray">No products found in this category.</Alert>
      ) : (
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
      )}
    </Container>
  );
};

export default CategoryProducts;
