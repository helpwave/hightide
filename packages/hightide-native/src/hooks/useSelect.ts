import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import {
  useEventCallbackStabilizer,
  useListNavigation,
  useSearch,
  useSingleSelection,
  useTypeAheadSearch
} from '@helpwave/hightide-utils/hooks'

export interface UseSelectOption {
  id: string,
  label?: string,
  disabled?: boolean,
}

export interface UseSelectOptions {
  options: ReadonlyArray<UseSelectOption>,
  value?: string | null,
  initialValue?: string | null,
  initialIsOpen?: boolean,
  onValueChange?: (value: string) => void,
  onEditComplete?: (value: string) => void,
  onClose?: () => void,
  onIsOpenChange?: (isOpen: boolean) => void,
  typeAheadResetMs?: number,
}

export type UseSelectFirstHighlightBehavior = 'first' | 'last'

export interface UseSelectState {
  value: string | null,
  highlightedValue: string | null,
  isOpen: boolean,
  searchQuery: string,
  options: ReadonlyArray<UseSelectOption>,
}

export interface UseSelectComputedState {
  visibleOptionIds: ReadonlyArray<string>,
}

export interface UseSelectActions {
  setIsOpen: (isOpen: boolean, behavior?: UseSelectFirstHighlightBehavior) => void,
  toggleOpen: (behavior?: UseSelectFirstHighlightBehavior) => void,
  setSearchQuery: (query: string) => void,
  highlightFirst: () => void,
  highlightLast: () => void,
  highlightNext: () => void,
  highlightPrevious: () => void,
  highlightItem: (value: string) => void,
  selectValue: (value: string) => void,
  handleTypeaheadKey: (key: string) => void,
}

export interface UseSelectReturn extends UseSelectState, UseSelectComputedState, UseSelectActions {}

export function useSelect({
  options,
  value: controlledValue,
  onValueChange,
  onEditComplete,
  initialValue = null,
  onClose,
  onIsOpenChange,
  initialIsOpen = false,
  typeAheadResetMs = 500,
}: UseSelectOptions): UseSelectReturn {
  const [isOpen, setIsOpen] = useState(initialIsOpen)
  const [searchQuery, setSearchQuery] = useState('')

  const onValueChangeStable = useEventCallbackStabilizer(onValueChange)
  const onEditCompleteStable = useEventCallbackStabilizer(onEditComplete)
  const onCloseStable = useEventCallbackStabilizer(onClose)
  const onIsOpenChangeStable = useEventCallbackStabilizer(onIsOpenChange)

  const onSelectionChangeWrapper = useCallback((id: string | null) => {
    if (id === null) return
    onValueChangeStable(id)
    onEditCompleteStable(id)
    setIsOpen(false)
  }, [onValueChangeStable, onEditCompleteStable])

  const { selection, selectValue } = useSingleSelection({
    options,
    selection: controlledValue,
    onSelectionChange: onSelectionChangeWrapper,
    initialSelection: initialValue,
  })

  const { searchResult: visibleOptions } = useSearch({
    items: options,
    searchQuery,
    toTags: useCallback((option: UseSelectOption) => [option.label ?? ''], []),
  })

  const visibleOptionIds = useMemo(() => visibleOptions.map((option) => option.id), [visibleOptions])
  const enabledOptions = useMemo(() => visibleOptions.filter((option) => !option.disabled), [visibleOptions])

  const {
    highlightedId,
    highlight: listNavHighlight,
    first: listNavFirst,
    last: listNavLast,
    next: listNavNext,
    previous: listNavPrevious,
  } = useListNavigation({
    options: enabledOptions.map((option) => option.id),
    initialValue: selection,
  })

  const { addToTypeAhead, reset: typeAheadReset } = useTypeAheadSearch({
    options: enabledOptions,
    resetTimer: typeAheadResetMs,
    toString: (option) => option.label ?? '',
    onResultChange: useCallback((option: UseSelectOption | null) => {
      if (option) listNavHighlight(option.id)
    }, [listNavHighlight]),
  })

  useEffect(() => {
    if (!isOpen) typeAheadReset()
  }, [isOpen, typeAheadReset])

  const highlightItem = useCallback((value: string) => {
    if (!enabledOptions.some((option) => option.id === value)) return
    listNavHighlight(value)
  }, [enabledOptions, listNavHighlight])

  const setIsOpenWrapper = useCallback((nextIsOpen: boolean, behavior?: UseSelectFirstHighlightBehavior) => {
    const highlightBehavior = behavior ?? 'first'
    if (nextIsOpen) {
      if (selection == null) {
        if (highlightBehavior === 'first') {
          listNavFirst()
        } else {
          listNavLast()
        }
      } else {
        highlightItem(selection)
      }
    } else {
      setSearchQuery('')
      onCloseStable?.()
    }
    setIsOpen(nextIsOpen)
    onIsOpenChangeStable(nextIsOpen)
  }, [highlightItem, listNavFirst, listNavLast, onCloseStable, onIsOpenChangeStable, selection])

  const toggleOpenWrapper = useCallback((behavior?: UseSelectFirstHighlightBehavior) => {
    setIsOpenWrapper(!isOpen, behavior)
  }, [isOpen, setIsOpenWrapper])

  const state: UseSelectState = useMemo(() => ({
    value: selection,
    highlightedValue: highlightedId,
    isOpen,
    searchQuery,
    options,
  }), [selection, highlightedId, isOpen, searchQuery, options])

  const computedState: UseSelectComputedState = useMemo(() => ({
    visibleOptionIds,
  }), [visibleOptionIds])

  const actions: UseSelectActions = useMemo(() => ({
    selectValue,
    setIsOpen: setIsOpenWrapper,
    toggleOpen: toggleOpenWrapper,
    setSearchQuery,
    highlightFirst: listNavFirst,
    highlightLast: listNavLast,
    highlightNext: listNavNext,
    highlightPrevious: listNavPrevious,
    highlightItem,
    handleTypeaheadKey: addToTypeAhead,
  }), [
    selectValue,
    setIsOpenWrapper,
    toggleOpenWrapper,
    listNavFirst,
    listNavLast,
    listNavNext,
    listNavPrevious,
    highlightItem,
    addToTypeAhead,
  ])

  return useMemo(() => ({
    ...state,
    ...computedState,
    ...actions,
  }), [state, computedState, actions])
}
