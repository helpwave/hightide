import { useCallback, useEffect, useMemo, useState } from 'react'
import { MultiSubjectSearchWithMapping } from '../util/simpleSearch'

export type UseSearchProps<T> = {
  list: T[],
  searchMapping: (item: T) => string[],
  initialSearch?: string,
  additionalSearchTags?: string[],
  isSearchInstant?: boolean,
}

export const useSearch = <T>({
                               list,
                               initialSearch,
                               searchMapping,
                               additionalSearchTags,
                               isSearchInstant = true,
                             }: UseSearchProps<T>) => {
  const [search, setSearch] = useState<string>(initialSearch)
  const [result, setResult] = useState<T[]>(list)
  const searchTags = useMemo(() => additionalSearchTags ?? [], [additionalSearchTags])

  const updateSearch = useCallback((newSearch?: string) => {
    const usedSearch = newSearch ?? search
    if (newSearch) {
      setSearch(search)
    }
    setResult(MultiSubjectSearchWithMapping([usedSearch, ...searchTags], list, searchMapping))
  }, [searchTags, list, search, searchMapping])

  useEffect(() => {
    if (isSearchInstant) {
      setResult(MultiSubjectSearchWithMapping([search, ...searchTags], list, searchMapping))
    }
  }, [searchTags, isSearchInstant, list, search, searchMapping, additionalSearchTags])

  return {
    result,
    hasResult: result.length > 0,
    allItems: list,
    updateSearch,
    search,
    setSearch,
  }
}