'use client'

import React, { useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  LoadingOverlay,
  Box,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useAuth } from "@/app/context/context";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from '@mantine/form';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    initialValues: {
      phone: '',
      password: '',
    },
    validate: {
      phone: (value: string) => (/^998\d{9}$/.test(value) ? null : 'Неверный формат номера телефона'),
      password: (value: string | any[]) => (value.length > 0 ? null : 'Требуется пароль'),
    },
  });

  const handleSubmit = async (values: { phone: string; password: string }) => {
    setIsLoading(true);
    try {
      await login(values.phone, values.password);
      notifications.show({
        title: 'Успешно',
        message: 'Вы успешно вошли в систему',
        color: 'green',
      });
      console.log('Login successful, notification should show');  
      setTimeout(() => router.push('/products'), 1000);
    } catch (error: any) {
      notifications.show({
        title: 'Ошибка',
        message: error.response?.data?.errMessage || 'Не удалось войти. Пожалуйста, проверьте свои данные и попробуйте снова.',
        color: 'red',
      });
      console.error('Login error:', error);  
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <Paper
        radius="md"
        p="xl"
        withBorder
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 400
        }}
      >
        <LoadingOverlay visible={isLoading} />
        <Title order={2} mb="md">С возвращением</Title>
        
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            required
            label="Телефон"
            placeholder="998 90 123 45 67"
            {...form.getInputProps('phone')}
          />
          <PasswordInput
            required
            label="Пароль"
            placeholder="Ваш пароль"
            mt="md"
            {...form.getInputProps('password')}
          />
          <Button fullWidth mt="xl" type="submit" loading={isLoading}>
            Войти
          </Button>
        </form>

        <Text mt="md" size="sm">
          Нет аккаунта?{' '}
          <Link href="/register">
            Зарегистрироваться
          </Link>
        </Text>
        <Text mt="md" size="sm">
          Хотите вернуться на главную страницу?{' '}
          <Link href="/products">
            Назад к продуктам
          </Link>
        </Text>
      </Paper>
    </Box>
  );
};