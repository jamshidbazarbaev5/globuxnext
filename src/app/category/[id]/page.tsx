'use client';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useProducts, useCategory } from '@/app/api/query/query';
import { Loader, Container } from '@mantine/core';
import { Suspense } from 'react';

const CategoryProducts = dynamic(() => import('@/app/components/CategoryProducts'), {
  ssr: false
});

const LoadingContainer = () => (
  <Container className="h-screen flex items-center justify-center">
    <Loader size="xl" />
  </Container>
);

export default function CategoryPage() {
  const { id } = useParams() as { id: string };
  const categoryId = parseInt(id, 10);

  const { data: productsData, isLoading: productsLoading } = useProducts(categoryId);
  const { data: category, isLoading: categoryLoading } = useCategory(categoryId);

  if (productsLoading || categoryLoading) {
    return <LoadingContainer />;
  }

  return (
    <Suspense fallback={<LoadingContainer />}>
      <CategoryProducts 
        category={category || {id: categoryId, name: '', parent: null}} 
        products={productsData?.items || []} 
      />
    </Suspense>
  );
}
