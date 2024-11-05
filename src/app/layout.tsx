'use client'
import { AppShell } from '@mantine/core'
import '@mantine/core/styles.css'
import { Providers } from './providers'
import { AuthProvider } from './context/context'
import Header from './components/Header'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AuthProvider>
            <AppShell
              header={{ height: 60 }}
            >
              <AppShell.Header>
                <Header />
              </AppShell.Header>
              
              <AppShell.Main>
                {children}
              </AppShell.Main>
            </AppShell>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}