import type { ReactNode } from 'react'
import { useEffect, useId, useMemo, useRef } from 'react'
import { MultiSelectContext } from './MultiSelectContext'
import type { MultiSelectContextConfig, MultiSelectContextLayout, MultiSelectIconAppearance } from './MultiSelectContext'
import { createMultiSelectState, multiSelectStateTransition, type MultiSelectEvent } from './MultiSelectState'
import type { DOMInputValueProps } from '../../domInput'
import { useStateManager, useTypeAheadSearch } from '@helpwave/hightide-utils/hooks'
import { PopUpContext } from '../../../layout/PopUp/PopUpContext'
import type { SelectionOptionData, SelectionOptionInput } from '../option'
import { normalizeSelectionOptions, scrollHighlightedOption, useOptionRefs } from '../option'

export interface MultiSelectIds {
  trigger: string,
  content: string,
  listbox: string,
  searchInput: string,
}

export type { MultiSelectEvent } from './MultiSelectState'

export interface MultiSelectStateManagerProps<T> extends DOMInputValueProps<T[], MultiSelectEvent<T>> {
  options: ReadonlyArray<SelectionOptionInput<T>>,
  compareFunction?: (a: T, b: T) => boolean,
  initialIsOpen?: boolean,
  onClose?: () => void,
  searchableThreshold?: number,
  iconAppearance?: MultiSelectIconAppearance,
  hasClearIcon?: boolean,
  ids?: Partial<MultiSelectIds>,
  children: ReactNode,
}

function sameIds(left: readonly string[], right: readonly string[]) {
  return left.length === right.length && left.every((id, index) => id === right[index])
}

export function MultiSelectStateManager<T>({
  children,
  options,
  value,
  onValueChange,
  onStateEvent,
  initialValue,
  compareFunction,
  initialIsOpen = false,
  onClose,
  searchableThreshold = 7,
  iconAppearance = 'right',
  hasClearIcon = false,
  ids: idsOverride,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  id,
}: MultiSelectStateManagerProps<T>) {
  const triggerRef = useRef<HTMLElement | null>(null)
  const normalizedOptions = useMemo(() => normalizeSelectionOptions(options), [options])
  const optionIds = useMemo(() => normalizedOptions.map((option) => option.id), [normalizedOptions])
  const optionRefs = useOptionRefs(optionIds)
  const optionRefsRef = useRef(optionRefs)
  optionRefsRef.current = optionRefs
  const generatedId = useId()
  const ids = useMemo<MultiSelectIds>(() => ({
    trigger: idsOverride?.trigger ?? id ?? 'multi-select-' + generatedId,
    content: idsOverride?.content ?? 'multi-select-content-' + generatedId,
    listbox: idsOverride?.listbox ?? 'multi-select-listbox-' + generatedId,
    searchInput: idsOverride?.searchInput ?? 'multi-select-search-' + generatedId,
  }), [
    generatedId,
    id,
    idsOverride?.content,
    idsOverride?.listbox,
    idsOverride?.searchInput,
    idsOverride?.trigger,
  ])

  const compare = useMemo(() => compareFunction ?? Object.is, [compareFunction])
  const seededValue = value !== undefined ? value : initialValue
  const seededIds = useMemo(() => {
    const idsForValue: string[] = []
    for (const item of seededValue ?? []) {
      const match = normalizedOptions.find((option) => compare(option.value, item))
      if (match && !idsForValue.includes(match.id)) idsForValue.push(match.id)
    }
    return idsForValue
  }, [compare, normalizedOptions, seededValue])

  const machine = useStateManager({
    initialState: () => createMultiSelectState({
      options: normalizedOptions,
      selectedIds: seededIds,
      isOpen: initialIsOpen,
    }),
    transition: multiSelectStateTransition<T>,
    onStateChange: (next, transition) => {
      if (!transition) return
      const previous = transition.previousState
      const event = transition.event
      const selectionChanged = !sameIds(next.selectedIds, previous.selectedIds)
      if ((event.type === 'toggle' || event.type === 'clear') && selectionChanged) {
        onValueChange?.([...next.value])
      }
      onStateEvent?.(event)
      if (event.type === 'clear') {
        onClose?.()
        onStateEvent?.({ type: 'commit', value: [...next.value] })
        return
      }
      if ((event.type === 'setOpen' || event.type === 'toggleOpen') && !next.isOpen && previous.isOpen) {
        onClose?.()
        onStateEvent?.({ type: 'commit', value: [...next.value] })
      }
    },
  })
  const { dispatch, state } = machine
  const visibleOptionIds = useMemo(
    () => state.visibleOptions.map((option) => option.id),
    [state.visibleOptions]
  )
  const enabledVisibleOptions = useMemo(
    () => state.visibleOptions.filter((option) => !option.disabled),
    [state.visibleOptions]
  )
  const hasSearch = state.options.length >= searchableThreshold

  const { addToTypeAhead, reset: resetTypeAhead } = useTypeAheadSearch({
    options: enabledVisibleOptions,
    resetTimer: 500,
    toString: (option) => option.label,
    onResultChange: (option) => {
      if (!option) return
      dispatch({ type: 'highlight', id: option.id })
    },
  })

  useEffect(() => {
    if (!state.isOpen) resetTypeAhead()
  }, [resetTypeAhead, state.isOpen])

  useEffect(() => {
    dispatch({ type: 'setOptions', options: normalizedOptions })
  }, [dispatch, normalizedOptions])

  const controlledIds = useMemo(() => {
    if (value === undefined) return undefined
    const nextIds: string[] = []
    for (const item of value) {
      const match = normalizedOptions.find((option) => compare(option.value, item))
      if (match && !nextIds.includes(match.id)) nextIds.push(match.id)
    }
    return nextIds
  }, [compare, normalizedOptions, value])

  useEffect(() => {
    if (controlledIds === undefined) return
    dispatch({ type: 'syncSelection', ids: controlledIds })
  }, [controlledIds, dispatch])

  useEffect(() => {
    if (!hasSearch && state.searchQuery !== '') {
      dispatch({ type: 'setSearch', query: '' })
    }
  }, [dispatch, hasSearch, state.searchQuery])

  useEffect(() => {
    scrollHighlightedOption(state.highlightedId, optionRefsRef.current)
  }, [state.highlightedId, state.isOpen])

  const idToOptionMap = useMemo(() => {
    return state.options.reduce((acc, option) => {
      acc[option.id] = option
      return acc
    }, {} as Record<string, SelectionOptionData<T>>)
  }, [state.options])

  const config: MultiSelectContextConfig = useMemo(() => ({
    iconAppearance,
    hasClearIcon,
    ids,
  }), [hasClearIcon, iconAppearance, ids])

  const layout: MultiSelectContextLayout = useMemo(() => ({
    triggerRef,
  }), [triggerRef])

  return (
    <MultiSelectContext.Provider
      value={{
        isInvalid,
        isDisabled,
        isReadOnly,
        isRequired,
        selectedIds: state.selectedIds,
        highlightedId: state.highlightedId,
        isOpen: state.isOpen,
        options: state.options,
        optionRefs,
        visibleOptionIds,
        idToOptionMap,
        value: [...state.value],
        toggleSelection: (optionId, selected) => dispatch({ type: 'toggle', id: optionId, selected }),
        clear: () => dispatch({ type: 'clear' }),
        highlightFirst: () => dispatch({ type: 'highlightFirst' }),
        highlightLast: () => dispatch({ type: 'highlightLast' }),
        highlightNext: () => dispatch({ type: 'highlightNext' }),
        highlightPrevious: () => dispatch({ type: 'highlightPrevious' }),
        highlightItem: (optionId) => dispatch({ type: 'highlight', id: optionId }),
        handleTypeaheadKey: addToTypeAhead,
        setIsOpen: (open, behavior) => dispatch({ type: 'setOpen', isOpen: open, behavior }),
        toggleIsOpen: (behavior) => dispatch({ type: 'toggleOpen', behavior }),
        config,
        layout,
        search: {
          hasSearch,
          searchQuery: state.searchQuery,
          setSearchQuery: (query) => dispatch({ type: 'setSearch', query }),
        },
      }}
    >
      <PopUpContext.Provider
        value={{
          state: { isOpen: state.isOpen },
          dispatch: (event) => {
            if (event.type === 'open') {
              dispatch({ type: 'setOpen', isOpen: true })
              return
            }
            if (event.type === 'close') {
              dispatch({ type: 'setOpen', isOpen: false })
              return
            }
            if (event.type === 'toggle') {
              dispatch({ type: 'toggleOpen' })
            }
          },
          popUpId: ids.content,
          triggerId: ids.trigger,
          triggerRef,
        }}
      >
        {children}
      </PopUpContext.Provider>
    </MultiSelectContext.Provider>
  )
}
