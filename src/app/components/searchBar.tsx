'use client'
import { TextInput } from "@mantine/core"
import { IconSearch } from "@tabler/icons-react"
import { useCallback, useEffect, useState } from "react"
import debounce from "lodash/debounce"
import { useDispatch } from "react-redux"
import { setSearchTerm } from "../redux/searchSlice"

export default function SearchBar() {
  const [inputValue, setInputValue] = useState<string>("")
  const dispatch = useDispatch()
  
  const debouncedDispatch = useCallback(
    debounce((value: string) => {
      dispatch(setSearchTerm(value))
    }, 500),
    [dispatch]
  )

  useEffect(() => {
    if (inputValue === '') {
      dispatch(setSearchTerm(''))
    } else {
      debouncedDispatch(inputValue)
    }

    return () => {
      debouncedDispatch.cancel()
    }
  }, [inputValue, debouncedDispatch, dispatch])

  return (
    <TextInput
      placeholder="Search products..."
      leftSection={<IconSearch size={16} stroke={1.5} />}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      style={{ minWidth: '300px' }}
      radius="md"
    />
  )
}