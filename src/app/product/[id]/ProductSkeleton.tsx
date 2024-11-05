import { Container, Skeleton, Grid, Card } from "@mantine/core"

export default function ProductSkeleton() {
  return (
    <Container size="xl" py="xl">
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="lg" padding="lg" radius="md" withBorder>
            <Card.Section>
              <Skeleton height={400} />
            </Card.Section>
            <Card.Section p="md">
              <Skeleton height={30} width="70%" mb="md" />
              <Skeleton height={24} width="40%" mb="md" />
              <Skeleton height={100} />
            </Card.Section>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  )
}