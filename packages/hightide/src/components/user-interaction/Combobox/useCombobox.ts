import { useCallback, useMemo } from 'react'
import { useListNavigation } from '@/src/hooks/useListNavigation'
import { useControlledState } from '@/src/hooks/useControlledState'
import { useSearch } from '@/src/hooks/useSearch'

export interface UseComboboxOption {
  id: string,
  label?: string,
  disabled?: boolean,
}

export interface UseComboboxOptions {
  options: ReadonlyArray<UseComboboxOption>,
  searchQuery?: string,
  onSearchQueryChange?: (query: string) => void,
  initialSearchQuery?: string,
}

export interface UseComboboxState {
  searchQuery: string,
  highlightedId: string | null,
}

export interface UseComboboxComputedState {
  visibleOptionIds: ReadonlyArray<string>,
}

export interface UseComboboxActions {
  setSearchQuery: (query: string) => void,
  highlightFirst: () => void,
  highlightLast: () => void,
  highlightNext: () => void,
  highlightPrevious: () => void,
  highlightItem: (id: string) => void,
}

export interface UseComboboxReturn extends UseComboboxState, UseComboboxComputedState, UseComboboxActions {}

export function useCombobox({
  options,
  searchQuery: controlledSearchQuery,
  onSearchQueryChange,
  initialSearchQuery = '',
}: UseComboboxOptions): UseComboboxReturn {
  const [searchQuery, setSearchQuery] = useControlledState({
    value: controlledSearchQuery,
    onValueChange: onSearchQueryChange,
    defaultValue: initialSearchQuery,
  })

  const { searchResult: visibleOptions } = useSearch({
    items: options,
    searchQuery: searchQuery ?? '',
    toTags: useCallback((o: UseComboboxOption) => [o.label], []),
  })

  const visibleOptionIds = useMemo(
    () => visibleOptions.map((o) => o.id),
    [visibleOptions]
  )

  const enabledOptionIds = useMemo(
    () => visibleOptions.filter((o) => !o.disabled).map((o) => o.id),
    [visibleOptions]
  )

  const listNav = useListNavigation({ options: enabledOptionIds })

  const highlightItem = useCallback(
    (id: string) => {
      if (!enabledOptionIds.includes(id)) return
      listNav.highlight(id)
    },
    [enabledOptionIds, listNav]
  )

  const state: UseComboboxState = useMemo(
    () => ({
      searchQuery: searchQuery ?? '',
      highlightedId: listNav.highlightedId,
    }),
    [searchQuery, listNav.highlightedId]
  )

  const computedState: UseComboboxComputedState = useMemo(
    () => ({ visibleOptionIds }),
    [visibleOptionIds]
  )

  const actions: UseComboboxActions = useMemo(
    () => ({
      setSearchQuery,
      highlightFirst: listNav.first,
      highlightLast: listNav.last,
      highlightNext: listNav.next,
      highlightPrevious: listNav.previous,
      highlightItem,
    }),
    [setSearchQuery, listNav.first, listNav.last, listNav.next, listNav.previous, highlightItem]
  )

  return useMemo(
    (): UseComboboxReturn => ({
      ...state,
      ...computedState,
      ...actions,
    }),
    [state, computedState, actions]
  )
}
