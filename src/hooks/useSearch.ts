import { useEffect, useMemo, useState } from 'react'
import { MultiSearchWithMapping } from '../util/simpleSearch'

export type UseSearchProps<T> = {
  list: T[],
  searchMapping: (item: T) => string[],
  initialSearch?: string,
}

export const useSearch = <T>({
                               list,
                               initialSearch,
                               searchMapping,
                             }: UseSearchProps<T>) => {
  const [items, setItems] = useState<T[]>(list)
  const [search, setSearch] = useState<string>(initialSearch)

  useEffect(() => {
    setItems(list)
  }, [list])

  const result: T[] = useMemo(
    () => MultiSearchWithMapping(search, items, searchMapping),
    [search, items, searchMapping]
  )

  return {
    result,
    hasResult: result.length > 0,
    allItems: items,
    setItems,
    search,
    setSearch,
  }
}