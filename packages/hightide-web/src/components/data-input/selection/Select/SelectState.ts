import { MultiSearchWithMapping } from '@helpwave/hightide-utils/utils'
import type { SelectionOptionData } from '../option'

export type UseSelectFirstHighlightBehavior = 'first' | 'last'

export type SelectState<T> = {
  options: ReadonlyArray<SelectionOptionData<T>>,
  readonly visibleOptions: ReadonlyArray<SelectionOptionData<T>>,
  value: T | null,
  selectedId: string | null,
  resolvedSelectedId: string | null,
  highlightedId: string | null,
  isOpen: boolean,
  searchQuery: string,
}

export type SelectEvent<T> =
  | { type: 'setOptions', options: ReadonlyArray<SelectionOptionData<T>> }
  | { type: 'syncSelection', id: string | null }
  | { type: 'select', id: string }
  | { type: 'clear' }
  | { type: 'setOpen', isOpen: boolean, behavior?: UseSelectFirstHighlightBehavior }
  | { type: 'toggleOpen', behavior?: UseSelectFirstHighlightBehavior }
  | { type: 'setSearch', query: string }
  | { type: 'highlight', id: string }
  | { type: 'highlightFirst' }
  | { type: 'highlightLast' }
  | { type: 'highlightNext' }
  | { type: 'highlightPrevious' }

function matchingOptions<T>(state: SelectState<T>): SelectionOptionData<T>[] {
  const query = state.searchQuery.trim()
  if (!query) return [...state.options]
  return MultiSearchWithMapping(state.searchQuery, [...state.options], (option) => [option.label])
}

function navigableIds<T>(options: ReadonlyArray<SelectionOptionData<T>>): string[] {
  return options.filter((option) => !option.disabled).map((option) => option.id)
}

function hasOption<T>(options: ReadonlyArray<SelectionOptionData<T>>, id: string | null): id is string {
  return id != null && options.some((option) => option.id === id)
}

function resolveSelectedId<T>(
  options: ReadonlyArray<SelectionOptionData<T>>,
  selectedId: string | null
): string | null {
  if (selectedId == null) return null
  if (hasOption(options, selectedId)) return selectedId
  return (options.find((option) => !option.disabled) ?? options[0])?.id ?? null
}

function resolveHighlightedId<T>(
  visibleOptions: ReadonlyArray<SelectionOptionData<T>>,
  highlightedId: string | null,
  resolvedSelectedId: string | null
): string | null {
  const navigable = navigableIds(visibleOptions)
  if (navigable.length === 0) return null
  if (highlightedId != null && navigable.includes(highlightedId)) return highlightedId
  if (resolvedSelectedId != null && navigable.includes(resolvedSelectedId)) return resolvedSelectedId
  return navigable[0]
}

function finalize<T>(state: SelectState<T>): SelectState<T> {
  const visibleOptions = matchingOptions(state)
  const resolvedSelectedId = resolveSelectedId(state.options, state.selectedId)
  const highlightedId = resolveHighlightedId(visibleOptions, state.highlightedId, resolvedSelectedId)
  const value = resolvedSelectedId == null
    ? null
    : state.options.find((option) => option.id === resolvedSelectedId)?.value ?? null
  return {
    ...state,
    visibleOptions,
    value,
    resolvedSelectedId,
    highlightedId,
  }
}

export function createSelectState<T>({
  options,
  selectedId,
  isOpen,
}: {
  options: ReadonlyArray<SelectionOptionData<T>>,
  selectedId: string | null,
  isOpen: boolean,
}): SelectState<T> {
  return finalize({
    options,
    value: null,
    selectedId,
    visibleOptions: [],
    resolvedSelectedId: null,
    highlightedId: selectedId,
    isOpen,
    searchQuery: '',
  })
}

function highlightForOpen<T>(
  state: SelectState<T>,
  behavior: UseSelectFirstHighlightBehavior
): string | null {
  const navigable = navigableIds(matchingOptions(state))
  if (navigable.length === 0) return null
  if (state.selectedId == null) {
    return behavior === 'last' ? navigable[navigable.length - 1] : navigable[0]
  }
  if (navigable.includes(state.selectedId)) return state.selectedId
  return navigable[0]
}

function withOpen<T>(
  state: SelectState<T>,
  isOpen: boolean,
  behavior: UseSelectFirstHighlightBehavior = 'first'
): SelectState<T> {
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
  state: SelectState<T>,
  direction: 'next' | 'previous' | 'first' | 'last'
): SelectState<T> {
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

export function selectStateTransition<T>(
  state: SelectState<T>,
  event: SelectEvent<T>
): SelectState<T> {
  switch (event.type) {
  case 'setOptions':
    return finalize({ ...state, options: event.options })
  case 'syncSelection':
    return finalize({ ...state, selectedId: event.id })
  case 'select': {
    const option = state.options.find((item) => item.id === event.id)
    if (!option || option.disabled) return state
    return finalize({
      ...state,
      selectedId: option.id,
      isOpen: false,
      searchQuery: '',
    })
  }
  case 'clear':
    return finalize({
      ...state,
      selectedId: null,
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
  }
}
