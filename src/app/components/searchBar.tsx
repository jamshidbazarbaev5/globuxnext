'use client'
import { TextInput } from "@mantine/core"
import { IconSearch } from "@tabler/icons-react"
import { useCallback, useState, useTransition } from "react"
import { useRouter, useSearchParams } from 'next/navigation'
import { usePathname } from 'next/navigation'

export default function SearchBar() {
  const [inputValue, setInputValue] = useState<string>("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const handleSearch = useCallback((value: string) => {
    const newPath = value === '' 
      ? '/products' 
      : `${pathname}?${createQueryString('search', value)}`
    startTransition(() => {
      router.push(newPath)
    })
  }, [router, pathname, createQueryString])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    handleSearch(value)
  }

  return (
    <TextInput
      placeholder="Search products..."
      leftSection={<IconSearch size={16} stroke={1.5} />}
      value={inputValue}
      onChange={handleInputChange}
      w={'50%'}
      radius="md"
      disabled={isPending}
    />
  )
}