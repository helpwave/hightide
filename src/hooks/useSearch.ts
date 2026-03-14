import { useMemo } from 'react'
import { MultiSearchWithMapping } from '@/src/utils/simpleSearch'
import { useEventCallbackStabilizer } from '@/src/hooks/useEventCallbackStabelizer'

export interface UseSearchOptions<T> {
  items: ReadonlyArray<T>,
  searchQuery: string,
  toTags?: (value: T) => string[],
}

export interface UseSearchReturn<T> {
  searchResult: ReadonlyArray<T>,
}

function defaultToTags<T>(value: T): string[] {
  return [String(value)]
}

export function useSearch<T>({
  items,
  searchQuery,
  toTags,
}: UseSearchOptions<T>): UseSearchReturn<T> {
  const toTagsResolved = toTags ?? defaultToTags
  const toTagsStable = useEventCallbackStabilizer(toTagsResolved)

  const searchResult = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return items
    return MultiSearchWithMapping(searchQuery, [...items], (item) => toTagsStable(item))
  }, [items, searchQuery, toTagsStable])

  return useMemo((): UseSearchReturn<T> => ({
    searchResult,
  }), [searchResult])
}
