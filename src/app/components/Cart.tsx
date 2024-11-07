"use client";
import {
  useCart,
  useDeleteAllCartItems,
  useDeleteCartItem,
  useUpdateCartItem,
} from "../api/query/query";
import {
  LoadingOverlay,
  Center,
  Text,
  Button,
  Stack,
  Title,
  Container,
  Card,
  Box,
  Group,
  Image,
  NumberInput,
} from "@mantine/core"
import {notifications } from "@mantine/notifications"
import { IconShoppingCart, IconTrash } from "@tabler/icons-react";
import {useRouter} from "next/navigation"


interface ProductImage {
  id: number;
  image: string;
}





export default function Cart() {
  const { data: cartData, isLoading, error } = useCart();
  const updateCartItem = useUpdateCartItem();
  const deleteCartItem = useDeleteCartItem();
  const deleteAllCartItems = useDeleteAllCartItems();
  const router = useRouter();

  const handleProductClick = (productId: number) => {
    router.push(`/product/${productId}`);
  };
  if (isLoading) return <LoadingOverlay visible={true} />;
  if (error)
    return (
      <Center>
        <Text color="red">Ошибка загрузки корзины {error.message}</Text>
      </Center>
    );

  if (!cartData || !cartData.cart) {
    return (
      <Center>
        <Text>Данные корзины недоступны</Text>
      </Center>
    );
  }
  const cartItem = cartData.cart;
  const cartTotal = cartItem.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  if (cartItem.length === 0) {
    return (
      <Center style={{ height: 200 }}>
        <Stack align="center">
          <IconShoppingCart size={48} />
          <Title order={2}>Ваша Корзина пуста</Title>
        </Stack>
      </Center>
    );
  }

  const handleQuantityChange = async (
    id: number,
    newQuantity: number,
    productId: number
  ) => {
    try {
      await updateCartItem.mutateAsync({
        cartItemId: id,
        quantity: newQuantity,
        productId,
      });
      notifications.show({
        title: "Успешно",
        message: "Количество товара обновлено",
        color: "green",
      });
    } catch (error) {
      console.error("Ошибка при обновлении количества:", error);
      notifications.show({
        title: "Ошибка",
        message: "Не удалось обновить количество",
        color: "red",
      });
    }
  };
  const handleDeleteItem = async (id: number) => {
    try {
      await deleteCartItem.mutateAsync(id);
      notifications.show({
        title: "Успешно",
        message: "Товар удален из корзины",
        color: "green ",
      });
    } catch (error) {
      console.error("Ошибка при удалении товара из корзины:", error);
      notifications.show({
        title: "Ошибка",
        message: "Не удалось удалить товар из корзины",
        color: "red ",
      });
    }
  };

  const handleDeleteAllItems = async () => {
    try {
      await deleteAllCartItems.mutateAsync();
      notifications.show({
        title: "Успешно",
        message: "Корзина очищена",
        color: "green",
      });
    } catch (error) {
      console.error("Ошибка при очистке корзины:", error);
      notifications.show({
        title: "Ошибка",
        message: "Не удалось очистить корзину",
        color: "red",
      });
    }
  };

  return (
    <Container size="md">
      <Stack>
        <Title order={2}>Корзина</Title>
        {cartItem.map((item) => (
          <Card key={item.id} padding="lg" radius="md" withBorder>
            <Group justify="space-between">
              <Group>
                <Box
                  style={{ cursor: "pointer" }}
                  onClick={(e: { stopPropagation: () => void; }) => {
                    e.stopPropagation();
                    handleProductClick(item.product.id);
                  }}
                >
                  <Image
                    src={item.product.images[0]?.image}
                    width={100}
                    height={100}
                    alt={item.product.name}
                  />
                </Box>
                <Stack gap="xs">
                  <Text
                    fw={500}
                    style={{ cursor: "pointer" }}
                    onClick={(e: { stopPropagation: () => void; }) => {
                      e.stopPropagation();
                      handleProductClick(item.product.id);
                    }}
                  >
                    {item.product.name}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Цена: {item.product.price.toLocaleString()} сум
                  </Text>
                </Stack>
              </Group>
              <Group>
                <NumberInput
                  value={item.quantity}
                  min={1}
                  max={item.product.amount}
                  onChange={(value: any) =>
                    handleQuantityChange(
                      item.id,
                      Number(value),
                      item.product.id
                    )
                  }
                  styles={{ input: { width: 60 } }}
                />
                <Button
                  color="red"
                  variant="outline"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  <IconTrash size={20} />
                </Button>
              </Group>
            </Group>
          </Card>
        ))}
         <Group justify="space-between">
          <Text fw={700} size="lg">
            Общая сумма: {cartTotal.toLocaleString()} сум
          </Text>
          <Button color="red" onClick={handleDeleteAllItems}>
            <Group gap="xs">
              <IconTrash size={20} />
              <span>Очистить корзину</span>
            </Group>
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}
