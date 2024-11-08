"use client";
import React, { useState, useEffect } from "react";
import {
  useAddToCart,
  useProduct,
  useProducts,
} from "@/app/api/query/query";
import {
  Container,
  Text,
  Group,
  Badge,
  Button,
  Title,
  Paper,
  Grid,
  Skeleton,
  Card,
  Alert,
  Stack,
  Loader,
  NumberInput,
  Notification,
  Image,
} from "@mantine/core";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AlertCircle} from "lucide-react";
import { RootState } from "../redux/store";
import { IProduct } from "../models/models";
import { useAuth } from "../context/context";

const Component = ({ productId }: { productId: number }) => {
  const { data: product, isLoading, error } = useProduct(productId);
  const selectedCategory = useSelector(
    (state: RootState) => state.category.selectedCategory
  );
  const { user, isAuthenticated } = useAuth();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationColor, setNotificationColor] = useState<"red" | "teal">("red");
  const [quantity, setQuantity] = useState(1);
  const { data: relatedProductsData, isLoading: isRelatedLoading } =
    useProducts(selectedCategory || product?.category || 1, 1);
  const addToCartMutation = useAddToCart();
  const router = useRouter();
  console.log(product?.images[0]?.image);

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const handleAddToCart = () => {
    if (product) {
      addToCartMutation.mutate(
        { productId: product.id, quantity },
        {
          onSuccess: () => {
            setNotificationColor("teal");
            setNotificationMessage("Товар успешно добавлен в корзину");
            setShowNotification(true);
          },
          onError: (error) => {
            setNotificationColor("red");
            setNotificationMessage("Произошла ошибка при добавлении в корзину");
            setShowNotification(true);
          },
        }
      );
    }
  };

  const backToProducts = () => {
    router.push("/products");
  };
  
  const handleRelatedProductClick = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  if (isLoading) {
    return (
      <Container size="xl" py="xl">
        <Paper shadow="md" p="xl" radius="md" withBorder>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Skeleton height={400} radius="md" animate={true} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="md">
                <Skeleton height={28} radius="md" width="40%" />
                <Skeleton height={36} radius="md" width="70%" />
                <Skeleton height={24} radius="md" width="30%" />
                <Skeleton height={100} radius="md" />
                <Group grow>
                  <Skeleton height={42} radius="md" />
                  <Skeleton height={42} radius="md" />
                </Group>
              </Stack>
            </Grid.Col>
          </Grid>
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="md" py="xl">
        <Alert
          variant="filled"
          color="red"
          title="Ошибка"
          icon={<AlertCircle size={16} />}
        >
          {error.message ||
            "Не удалось загрузить детали продукта. Пожалуйста, попробуйте позже."}
        </Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container size="md" py="xl">
        <Alert
          variant="filled"
          color="yellow"
          title="Не найдено"
          icon={<AlertCircle size={16} />}
        >
          Продукт не найден.
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      {showNotification && (
        <Notification
          title={notificationColor === "teal" ? "Успех" : "Ошибка"}
          color={notificationColor}
          onClose={() => setShowNotification(false)}
          style={{ position: 'fixed', top: 20, right: 20, zIndex: 1000 }}
        >
          {notificationMessage}
        </Notification>
      )}
      <Paper shadow="sm" p="xl" radius="lg" withBorder>
      <Button style={{ marginTop: "-1rem",marginBottom: "0.8rem" }} onClick={backToProducts}>Назад к продуктам</Button>
    
        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper radius="md" withBorder>
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[0].image}
                  alt={product.name}
                  height={400}
                  width={400}
                />
              ) : (
                <Group
                  h={400}
                  justify="center"
                  align="center"
                  style={{ background: "var(--mantine-color-gray-1)" }}
                >
                  <Text c="dimmed">Изображение недоступно</Text>
                </Group>
              )}
            </Paper>
          </Grid.Col>
  
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="lg">
              <Title order={1} size="h2">
                {product.name}
              </Title>
  
              {product.discounts ? (
                <Group gap="xs">
                  <Text size="xl" fw={700} c="gray" style={{ textDecoration: "line-through" }}>
                    {product.price.toLocaleString()} сум
                  </Text>
                  <Text size="xl" fw={700} c="blue">
                    {product.discount_price?.toLocaleString()} сум
                  </Text>
                </Group>
              ) : (
                <Text size="xl" fw={700} c="blue">
                  {product.price.toLocaleString()} сум
                </Text>
              )}
  
              <Badge
                size="lg"
                variant="filled"
                color={product.discounts ? "green" : "red"}
                radius="sm"
              >
                {product.discounts ? "Cкидка" : "Нет в скидке"}
              </Badge>
              <Badge
                size="lg"
                variant="filled"
                color={'blue'}
                radius="sm"
              >
                {product.amount} количество
              </Badge>
  
              <Text c="dimmed" size="md">
                {product.description}
              </Text>
              {isAuthenticated && (
                <Group grow mt="md">
                  <NumberInput
                    value={quantity}
                    onChange={(value) => setQuantity(value as number)}
                    min={1}
                    max={product.amount}
                    style={{ width: "100px" }}
                  />
                  <Button
                    variant="filled"
                    color="blue"
                    onClick={handleAddToCart}
                    disabled={addToCartMutation.isPending}
                  >
                    Добавить в корзину
                  </Button>
                </Group>
              )}
            </Stack>
          </Grid.Col>
        </Grid>
      </Paper>
  
      <Title order={2} mt={48} mb="xl">
        Похожие продукты
      </Title>
  
      {isRelatedLoading ? (
        <Group justify="center" py="xl">
          <Loader size="lg" />
        </Group>
      ) : relatedProductsData?.items?.length ? (
        <Grid>
          {relatedProductsData?.items?.map((relatedProduct: IProduct) => (
            <Grid.Col key={relatedProduct.id} span={{ base: 12, sm: 6, lg: 3 }}>
              <Card
                shadow="sm"
                padding="md"
                radius="md"
                withBorder
                style={{ cursor: "pointer" }}
                onClick={() => handleRelatedProductClick(relatedProduct.id)}
              >
                <Card.Section>
                  <Image
                    src={relatedProduct.images[0].image}
                    height={200}
                    alt={relatedProduct.name}
                  />
                </Card.Section>
  
                <Stack mt="md" gap="xs">
                  <Text fw={500} lineClamp={1}>
                    {relatedProduct.name}
                  </Text>
                  <Text size="sm" c="blue" fw={500}>
                    {relatedProduct.price.toLocaleString()} сум
                  </Text>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      ) : (
        <Text c="dimmed" ta="center">
          Похожие продукты не найдены.
        </Text>
      )}
    </Container>
  );
  
};

export default Component;