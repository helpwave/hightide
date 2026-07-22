import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'

import {
  useEventCallbackStabilizer,
  useListNavigation,
  useMultiSelection,
  useSearch,
  useTypeAheadSearch
} from '@helpwave/hightide-utils/hooks'

export interface UseMultiSelectOption {
  id: string,
  label?: string,
  disabled?: boolean,
}

export interface UseMultiSelectOptions {
  options: ReadonlyArray<UseMultiSelectOption>,
  value?: ReadonlyArray<string>,
  onValueChange?: (value: string[]) => void,
  onEditComplete?: (value: string[]) => void,
  initialValue?: string[],
  initialIsOpen?: boolean,
  onClose?: () => void,
  typeAheadResetMs?: number,
}

export type UseMultiSelectFirstHighlightBehavior = 'first' | 'last'

export interface UseMultiSelectState {
  value: string[],
  highlightedId: string | null,
  isOpen: boolean,
  searchQuery: string,
  options: ReadonlyArray<UseMultiSelectOption>,
}

export interface UseMultiSelectComputedState {
  visibleOptionIds: ReadonlyArray<string>,
}

export interface UseMultiSelectActions {
  setIsOpen: (isOpen: boolean, behavior?: UseMultiSelectFirstHighlightBehavior) => void,
  toggleOpen: (behavior?: UseMultiSelectFirstHighlightBehavior) => void,
  setSearchQuery: (query: string) => void,
  highlightFirst: () => void,
  highlightLast: () => void,
  highlightNext: () => void,
  highlightPrevious: () => void,
  highlightItem: (id: string) => void,
  toggleSelection: (id: string, isSelected?: boolean) => void,
  setSelection: (ids: string[]) => void,
  isSelected: (id: string) => boolean,
  handleTypeaheadKey: (key: string) => void,
}

export interface UseMultiSelectReturn extends UseMultiSelectState, UseMultiSelectComputedState, UseMultiSelectActions {}

export function useMultiSelect({
  options,
  value: controlledValue,
  onValueChange,
  onEditComplete,
  initialValue = [],
  onClose,
  initialIsOpen = false,
  typeAheadResetMs = 500,
}: UseMultiSelectOptions): UseMultiSelectReturn {
  const [isOpen, setIsOpen] = useState(initialIsOpen)
  const [searchQuery, setSearchQuery] = useState('')

  const selectionOptions = useMemo(
    () => options.map((option) => ({ id: option.id, disabled: option.disabled })),
    [options]
  )

  const { selection, toggleSelection, setSelection, isSelected } = useMultiSelection({
    options: selectionOptions,
    value: controlledValue,
    onSelectionChange: (ids) => onValueChange?.(Array.from(ids)),
    initialSelection: initialValue,
    isControlled: controlledValue !== undefined,
  })

  const editCompleteStable = useEventCallbackStabilizer(onEditComplete)
  const onCloseStable = useEventCallbackStabilizer(onClose)

  const { searchResult: visibleOptions } = useSearch({
    items: options,
    searchQuery,
    toTags: useCallback((option: UseMultiSelectOption) => [option.label ?? ''], []),
  })

  const visibleOptionIds = useMemo(
    () => visibleOptions.map((option) => option.id),
    [visibleOptions]
  )

  const enabledOptions = useMemo(
    () => visibleOptions.filter((option) => !option.disabled),
    [visibleOptions]
  )

  const listNav = useListNavigation({
    options: enabledOptions.map((option) => option.id),
    initialValue: selection[0] ?? null,
  })

  const typeAhead = useTypeAheadSearch({
    options: enabledOptions,
    resetTimer: typeAheadResetMs,
    toString: (option) => option.label ?? '',
    onResultChange: useCallback(
      (option: UseMultiSelectOption | null) => {
        if (option) listNav.highlight(option.id)
      },
      [listNav]
    ),
  })

  useEffect(() => {
    if (!isOpen) typeAhead.reset()
  }, [isOpen, typeAhead])

  const highlightItem = useCallback((id: string) => {
    if (!enabledOptions.some((option) => option.id === id)) return
    listNav.highlight(id)
  }, [enabledOptions, listNav])

  const toggleSelectionValue = useCallback((id: string, newIsSelected?: boolean) => {
    const next = newIsSelected ?? !isSelected(id)
    if (next) {
      toggleSelection(id)
    } else {
      setSelection(selection.filter((selectedId) => selectedId !== id))
    }
    highlightItem(id)
  }, [highlightItem, isSelected, selection, setSelection, toggleSelection])

  const setIsOpenWrapper = useCallback(
    (open: boolean, behavior?: UseMultiSelectFirstHighlightBehavior) => {
      setIsOpen(open)
      const highlightBehavior = behavior ?? 'first'
      if (open) {
        if (enabledOptions.length > 0) {
          let selected: UseMultiSelectOption | undefined
          if (highlightBehavior === 'first') {
            selected = enabledOptions.find((option) => isSelected(option.id))
            selected ??= enabledOptions[0]
          } else {
            selected = [...enabledOptions]
              .reverse()
              .find((option) => isSelected(option.id))
            selected ??= enabledOptions[enabledOptions.length - 1]
          }
          if (selected) highlightItem(selected.id)
        }
      } else {
        setSearchQuery('')
        onCloseStable?.()
        editCompleteStable?.(Array.from(selection))
      }
    },
    [editCompleteStable, enabledOptions, highlightItem, isSelected, onCloseStable, selection]
  )

  const toggleOpenWrapper = useCallback(
    (behavior?: UseMultiSelectFirstHighlightBehavior) => {
      setIsOpenWrapper(!isOpen, behavior)
    },
    [isOpen, setIsOpenWrapper]
  )

  const state: UseMultiSelectState = useMemo(
    () => ({
      value: [...selection],
      highlightedId: listNav.highlightedId,
      isOpen,
      searchQuery,
      options,
    }),
    [selection, listNav.highlightedId, isOpen, searchQuery, options]
  )

  const computedState: UseMultiSelectComputedState = useMemo(
    () => ({ visibleOptionIds }),
    [visibleOptionIds]
  )

  const actions: UseMultiSelectActions = useMemo(
    () => ({
      setIsOpen: setIsOpenWrapper,
      toggleOpen: toggleOpenWrapper,
      setSearchQuery,
      highlightFirst: listNav.first,
      highlightLast: listNav.last,
      highlightNext: listNav.next,
      highlightPrevious: listNav.previous,
      highlightItem,
      toggleSelection: toggleSelectionValue,
      setSelection,
      isSelected,
      handleTypeaheadKey: typeAhead.addToTypeAhead,
    }),
    [
      setIsOpenWrapper,
      toggleOpenWrapper,
      listNav.first,
      listNav.last,
      listNav.next,
      listNav.previous,
      highlightItem,
      toggleSelectionValue,
      setSelection,
      isSelected,
      typeAhead.addToTypeAhead,
    ]
  )

  return useMemo(
    () => ({
      ...state,
      ...computedState,
      ...actions,
    }),
    [state, computedState, actions]
  )
}
