import { useCallback, useEffect, useMemo, useState } from 'react'
import { MultiSubjectSearchWithMapping } from '../util/simpleSearch'

export type UseSearchProps<T> = {
  list: T[],
  searchMapping: (item: T) => string[],
  initialSearch?: string,
  additionalSearchTags?: string[],
  isSearchInstant?: boolean,
  sortingFunction?: (a: T, b: T) => number,
  filter?: (item: T) => boolean,
  disabled?: boolean,
}

export const useSearch = <T>({
                               list,
                               initialSearch,
                               searchMapping,
                               additionalSearchTags,
                               isSearchInstant = true,
                               sortingFunction,
                               filter,
                               disabled = false,
                             }: UseSearchProps<T>) => {
  const [search, setSearch] = useState<string>(initialSearch ?? '')
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

  const filteredResult: T[] = useMemo(() => {
    if (!filter) {
      return result
    }
    return result.filter(filter)
  }, [result, filter])

  const sortedAndFilteredResult: T[] = useMemo(() => {
    if (!sortingFunction) {
      return filteredResult
    }
    return filteredResult.sort(sortingFunction)
  }, [filteredResult, sortingFunction])

  const usedResult = useMemo(() => {
    if (!disabled) {
      return sortedAndFilteredResult
    }
    return list
  }, [disabled, list, sortedAndFilteredResult])

  return {
    result: usedResult,
    hasResult: usedResult.length > 0,
    allItems: list,
    updateSearch,
    search,
    setSearch,
  }
}