'use client'
import React from 'react';
import { useAuth } from '../context/context';
import { Title, Text, Button, Group,  Card, Grid, Badge, ThemeIcon,  } from '@mantine/core';
import { IconPhone, IconCalendar, IconGenderBigender, IconCoin } from '@tabler/icons-react';

export default function UserProfile() {
  const { user, logout } = useAuth();

  if (!user) {
    return <Text ta="center">Loading...</Text>;
  }

  const userInfo = [
    { icon: <IconPhone size="1.2rem" />, label: 'Номер', value: user.phone },
    { icon: <IconCalendar size="1.2rem" />, label: 'Дата рождения', value: user.date_of_birth },
    { icon: <IconGenderBigender size="1.2rem" />, label: 'Пол', value: user.gender },
    { icon: <IconCoin size="1.2rem" />, label: 'Кешбек баланас', value: user.cashback_balance },
  ];

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="apart" mb="md">
        <div>
          <Title order={2}>{`${user.first_name} ${user.last_name}`}</Title>
          <Badge color="blue" variant="light" size="lg" mt="xs">
            Member
          </Badge>
        </div>
      </Group>

      <Grid mt="xl">
        {userInfo.map((item, index) => (
          <Grid.Col span={6} key={index}>
            <Group gap="sm">
              <ThemeIcon color="blue" variant="light" size={40} radius="xl">
                {item.icon}
              </ThemeIcon>
              <div>
                <Text size="xs" color="dimmed">
                  {item.label}
                </Text>
                <Text fw={500}>{item.value}</Text>
              </div>
            </Group>
          </Grid.Col>
        ))}
      </Grid>

      <Button
        fullWidth
        mt="xl"
        color="red"
        onClick={logout}
        styles={(theme) => ({
          root: {
            marginTop: theme.spacing.xl,
          },
        })}
      >
        Выйты
      </Button>
    </Card>
  );
}