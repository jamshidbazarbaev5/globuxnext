"use client";
import React from "react";
import { AppShell, Container, Grid } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Providers } from "./providers";
import { AuthProvider } from "./context/context";
import Header from "./components/Header";
import CategoryList from "./components/CategoryList";
import { usePathname } from "next/navigation";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const showCategoryList = [
    "/myorder",
    "/cart",
    "/profile",
    "/category",
    "/order",
    ].some((path) => pathname.startsWith(path));

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <Providers>
            <AuthProvider>
              <Notifications />
              <AppShell header={{ height: 60 }}>
                <AppShell.Header>
                  <Header />
                </AppShell.Header>

                <AppShell.Main>
                  <Container size="xl">
                    <Grid>
                      {showCategoryList && (
                        <Grid.Col span={3}>
                          <CategoryList initialCategories={[]} />
                        </Grid.Col>
                      )}
                      <Grid.Col span={showCategoryList ? 9 : 12}>
                        {children}
                      </Grid.Col>
                    </Grid>
                  </Container>
                </AppShell.Main>
              </AppShell>
            </AuthProvider>
          </Providers>
        </QueryClientProvider>
      </body>
    </html>
  );
}
