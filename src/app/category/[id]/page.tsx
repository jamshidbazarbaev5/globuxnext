'use client';

import CategoryProducts from '@/app/components/CategoryProducts';
import { useParams } from 'next/navigation';

export default function CategoryPage() {
  const params = useParams() as { id: string };
  const categoryId = parseInt(params.id, 10);

  return <CategoryProducts categoryId={categoryId} />;
}