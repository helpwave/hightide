import { MultiSearchWithMapping } from '@helpwave/hightide-utils/utils'
import type { SelectionOptionData } from '../option'

export type UseMultiSelectFirstHighlightBehavior = 'first' | 'last'

export type MultiSelectState<T> = {
  options: ReadonlyArray<SelectionOptionData<T>>,
  readonly visibleOptions: ReadonlyArray<SelectionOptionData<T>>,
  value: readonly T[],
  selectedIds: readonly string[],
  highlightedId: string | null,
  isOpen: boolean,
  searchQuery: string,
}

export type MultiSelectEvent<T> =
  | { type: 'setOptions', options: ReadonlyArray<SelectionOptionData<T>> }
  | { type: 'syncSelection', ids: readonly string[] }
  | { type: 'toggle', id: string, selected?: boolean }
  | { type: 'clear' }
  | { type: 'setOpen', isOpen: boolean, behavior?: UseMultiSelectFirstHighlightBehavior }
  | { type: 'toggleOpen', behavior?: UseMultiSelectFirstHighlightBehavior }
  | { type: 'setSearch', query: string }
  | { type: 'highlight', id: string }
  | { type: 'highlightFirst' }
  | { type: 'highlightLast' }
  | { type: 'highlightNext' }
  | { type: 'highlightPrevious' }
  | { type: 'commit', value: T[] }

function matchingOptions<T>(state: MultiSelectState<T>): SelectionOptionData<T>[] {
  const query = state.searchQuery.trim()
  if (!query) return [...state.options]
  return MultiSearchWithMapping(state.searchQuery, [...state.options], (option) => [option.label])
}

function navigableIds<T>(options: ReadonlyArray<SelectionOptionData<T>>): string[] {
  return options.filter((option) => !option.disabled).map((option) => option.id)
}

function resolveSelectedIds<T>(
  options: ReadonlyArray<SelectionOptionData<T>>,
  selectedIds: readonly string[]
): string[] {
  const known = new Set(options.map((option) => option.id))
  const resolved: string[] = []
  for (const id of selectedIds) {
    if (!known.has(id) || resolved.includes(id)) continue
    resolved.push(id)
  }
  return resolved
}

function resolveHighlightedId(
  visibleOptions: ReadonlyArray<SelectionOptionData<unknown>>,
  highlightedId: string | null,
  selectedIds: readonly string[]
): string | null {
  const navigable = navigableIds(visibleOptions)
  if (navigable.length === 0) return null
  if (highlightedId != null && navigable.includes(highlightedId)) return highlightedId
  const selected = selectedIds.find((id) => navigable.includes(id))
  if (selected != null) return selected
  return navigable[0]
}

function finalize<T>(state: MultiSelectState<T>): MultiSelectState<T> {
  const visibleOptions = matchingOptions(state)
  const selectedIds = resolveSelectedIds(state.options, state.selectedIds)
  const highlightedId = resolveHighlightedId(visibleOptions, state.highlightedId, selectedIds)
  const value = selectedIds.flatMap((id) => {
    const option = state.options.find((item) => item.id === id)
    return option ? [option.value] : []
  })
  return {
    ...state,
    visibleOptions,
    selectedIds,
    highlightedId,
    value,
  }
}

export function createMultiSelectState<T>({
  options,
  selectedIds,
  isOpen,
}: {
  options: ReadonlyArray<SelectionOptionData<T>>,
  selectedIds: readonly string[],
  isOpen: boolean,
}): MultiSelectState<T> {
  return finalize({
    options,
    visibleOptions: [],
    value: [],
    selectedIds,
    highlightedId: null,
    isOpen,
    searchQuery: '',
  })
}

function highlightForOpen<T>(
  state: MultiSelectState<T>,
  behavior: UseMultiSelectFirstHighlightBehavior
): string | null {
  const navigable = navigableIds(matchingOptions(state))
  if (navigable.length === 0) return null
  const selected = behavior === 'last'
    ? [...state.selectedIds].reverse().find((id) => navigable.includes(id))
    : state.selectedIds.find((id) => navigable.includes(id))
  if (selected != null) return selected
  return behavior === 'last' ? navigable[navigable.length - 1] : navigable[0]
}

function withOpen<T>(
  state: MultiSelectState<T>,
  isOpen: boolean,
  behavior: UseMultiSelectFirstHighlightBehavior = 'first'
): MultiSelectState<T> {
  if (isOpen) {
    return finalize({
      ...state,
      isOpen: true,
      highlightedId: highlightForOpen(state, behavior),
    })
  }
  return finalize({
    ...state,
    isOpen: false,
    searchQuery: '',
  })
}

function moveHighlight<T>(
  state: MultiSelectState<T>,
  direction: 'next' | 'previous' | 'first' | 'last'
): MultiSelectState<T> {
  const navigable = navigableIds(matchingOptions(state))
  if (navigable.length === 0) return finalize({ ...state, highlightedId: null })
  if (navigable.length === 1) return finalize({ ...state, highlightedId: navigable[0] })
  const current = state.highlightedId != null && navigable.includes(state.highlightedId)
    ? state.highlightedId
    : navigable[0]
  const index = navigable.indexOf(current)
  let highlightedId = current
  if (direction === 'first') highlightedId = navigable[0]
  else if (direction === 'last') highlightedId = navigable[navigable.length - 1]
  else if (direction === 'next') highlightedId = navigable[(index + 1) % navigable.length]
  else highlightedId = navigable[index <= 0 ? navigable.length - 1 : index - 1]
  return finalize({ ...state, highlightedId })
}

export function multiSelectStateTransition<T>(
  state: MultiSelectState<T>,
  event: MultiSelectEvent<T>
): MultiSelectState<T> {
  switch (event.type) {
  case 'setOptions':
    return finalize({ ...state, options: event.options })
  case 'syncSelection':
    return finalize({ ...state, selectedIds: event.ids })
  case 'toggle': {
    const option = state.options.find((item) => item.id === event.id)
    if (!option || option.disabled) return state
    const selected = event.selected ?? !state.selectedIds.includes(option.id)
    const selectedIds = selected
      ? state.selectedIds.includes(option.id) ? state.selectedIds : [...state.selectedIds, option.id]
      : state.selectedIds.filter((id) => id !== option.id)
    const navigable = navigableIds(matchingOptions(state))
    return finalize({
      ...state,
      selectedIds,
      highlightedId: navigable.includes(option.id) ? option.id : state.highlightedId,
    })
  }
  case 'clear':
    return finalize({
      ...state,
      selectedIds: [],
      isOpen: false,
      searchQuery: '',
    })
  case 'setOpen':
    return withOpen(state, event.isOpen, event.behavior)
  case 'toggleOpen':
    return withOpen(state, !state.isOpen, event.behavior)
  case 'setSearch':
    return finalize({ ...state, searchQuery: event.query })
  case 'highlight':
    if (!navigableIds(matchingOptions(state)).includes(event.id)) return state
    return finalize({ ...state, highlightedId: event.id })
  case 'highlightFirst':
    return moveHighlight(state, 'first')
  case 'highlightLast':
    return moveHighlight(state, 'last')
  case 'highlightNext':
    return moveHighlight(state, 'next')
  case 'highlightPrevious':
    return moveHighlight(state, 'previous')
  case 'commit':
    return state
  }
}
