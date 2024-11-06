'use client'

import { Box, Burger, Drawer, NavLink, Paper, ScrollArea, Skeleton, Stack } from "@mantine/core"
import { useCategories } from "../api/query/query"
import { ICategory } from "../models/models"
import { useDispatch, useSelector } from "react-redux"
import { setSelectedCategory } from "../redux/categorySlice"
import { RootState } from "../redux/store"
import { useState, useEffect } from "react"
import { useMediaQuery } from "@mantine/hooks"
import Link from "next/link"
import { GetStaticProps } from 'next'
import { api } from '../api/axios/axios'

interface CategoryListProps {
  initialCategories: ICategory[]
}

export const getStaticProps: GetStaticProps<CategoryListProps> = async () => {
  try {
    const response = await api.get('/categories')
    const initialCategories = response.data.data.categories

    return {
      props: {
        initialCategories,
      },
      revalidate: 60 * 60,
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return { props: { initialCategories: [] } }
  }
}

export default function Component({ initialCategories }: CategoryListProps) {
  const { data: categories, isLoading, isError } = useCategories()
  const selectedCategory = useSelector((state: RootState) => state.category.selectedCategory)
  const dispatch = useDispatch()
  const [opened, setOpened] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [displayCategories, setDisplayCategories] = useState(initialCategories)

  useEffect(() => {
    if (categories) {
      setDisplayCategories(categories)
    }
  }, [categories])

  const handleCategoryClick = (categoryId: number) => {
    dispatch(setSelectedCategory(categoryId))
    setOpened(false)
  }

  if (isLoading) {
    return (
      <Paper className="p-4">
        <Skeleton className="h-8 w-full" />
      </Paper>
    )
  }

  if (isError) {
    return (
      <Paper className="p-4">
        <Box className="text-red-500">Failed to load categories.</Box>
      </Paper>
    )
  }

  const categoryList = (
    <ScrollArea style={{ height: isMobile ? 'calc(100vh - 60px)' : '1770px' }}>
      <Stack className="gap-2">
        <Link href={`/category/0`} passHref legacyBehavior>
          <NavLink
            className={`rounded-md ${selectedCategory === 0 ? 'bg-primary text-primary-foreground' : ''}`}
            label="All Categories"
            active={selectedCategory === 0}
            onClick={() => handleCategoryClick(0)}
          />
        </Link>
        {displayCategories.map((category: ICategory) => (
          <Link 
            href={`/category/${category.id}`} 
            key={category.id} 
            passHref 
            legacyBehavior
          >
            <NavLink
              className={`rounded-md ${selectedCategory === category.id ? 'bg-primary text-primary-foreground' : ''}`}
              label={category.name}
              active={selectedCategory === category.id}
              onClick={() => handleCategoryClick(category.id)}
            />
          </Link>
        ))}
      </Stack>
    </ScrollArea>
  )

  return (
    <>
      {isMobile ? (
        <Box>
          <Burger opened={opened} onClick={() => setOpened((o) => !o)} />
          <Drawer
            opened={opened}
            onClose={() => setOpened(false)}
            size="100%"
            padding="md"
            title="Categories"
            closeButtonProps={{ size: 'lg' }}
          >
            {categoryList}
          </Drawer>
        </Box>
      ) : (
        <Paper className="p-4 w-64 h-[calc(100vh-100px)]">
          {categoryList}
         </Paper>
      )}
    </>
  )
}