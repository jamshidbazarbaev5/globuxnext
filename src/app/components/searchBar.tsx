'use client'
import { TextInput } from "@mantine/core"
import { IconSearch } from "@tabler/icons-react"
import { useCallback, useEffect, useState } from "react"
import debounce from "lodash/debounce"
import { useDispatch, useSelector } from "react-redux"
import { setSearchTerm } from "../redux/searchSlice"
import type { RootState } from "../redux/store"

export default function SearchBar() {
  // Local state for input value
  const [inputValue, setInputValue] = useState<string>("")
  
  // Get current search term from Redux store for validation
  const currentSearchTerm = useSelector((state: RootState) => state.search.searchTerm)
  const dispatch = useDispatch()

  // Handler for immediate input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.trim()
    setInputValue(newValue)
    
    // If input is cleared, immediately reset search
    if (newValue === '') {
      dispatch(setSearchTerm(''))
    }
  }

  // Debounced search dispatcher
  const debouncedDispatch = useCallback(
    debounce((value: string) => {
      console.log('Dispatching search term:', value) // Debug log
      dispatch(setSearchTerm(value.toLowerCase())) // Convert to lowercase for consistent searching
    }, 300), // Reduced debounce time for better responsiveness
    [dispatch]
  )

  // Effect to handle debounced search
  useEffect(() => {
    if (inputValue) {
      debouncedDispatch(inputValue)
    }

    return () => {
      debouncedDispatch.cancel()
    }
  }, [inputValue, debouncedDispatch])

  // Form submit handler for immediate search
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const searchValue = inputValue.trim()
    
    console.log('Form submitted with value:', searchValue) // Debug log
    dispatch(setSearchTerm(searchValue.toLowerCase()))
  }

  // Debug effect to monitor search term changes
  useEffect(() => {
    console.log('Current search term in Redux:', currentSearchTerm)
  }, [currentSearchTerm])

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl">
      <TextInput
        placeholder="Search products..."
        leftSection={<IconSearch size={16} stroke={1.5} />}
        value={inputValue}
        onChange={handleInputChange}
        className="w-full"
        styles={{
          input: {
            '&:focus': {
              borderColor: '#228be6',
            },
          },
        }}
        radius="md"
      />
    </form>
  )
}