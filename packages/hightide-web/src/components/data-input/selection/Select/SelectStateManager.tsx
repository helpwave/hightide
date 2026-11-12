import type { ReactNode, RefObject } from 'react'
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { SelectContext } from './SelectContext'
import type { SelectContextConfig, SelectContextLayout } from './SelectContext'
import { createSelectState, selectStateTransition, type SelectEvent } from './SelectState'
import type { DOMInputValueProps } from '../../domInput'
import { useStateManager, useTypeAheadSearch } from '@helpwave/hightide-utils/hooks'
import { PopUpContext } from '../../../layout/PopUp/PopUpContext'
import type { SelectionOptionData, SelectionOptionInput } from '../option'
import { normalizeSelectionOptions, scrollHighlightedOption, useOptionRefs } from '../option'

export interface SelectIds {
  trigger: string,
  content: string,
  listbox: string,
  searchInput: string,
}

export interface SelectStateManagerProps<T> extends DOMInputValueProps<T | null, SelectEvent<T>> {
  options: ReadonlyArray<SelectionOptionInput<T>>,
  compareFunction?: (a: T, b: T) => boolean,
  initialIsOpen?: boolean,
  onClose?: () => void,
  onIsOpenChange?: (isOpen: boolean) => void,
  searchableThreshold?: number,
  iconAppearance?: 'left' | 'right' | 'none',
  hasClearIcon?: boolean,
  ids?: Partial<SelectIds>,
  children: ReactNode,
}

export function SelectStateManager<T>({
  children,
  options,
  value,
  onValueChange,
  onStateEvent,
  initialValue,
  compareFunction,
  initialIsOpen = false,
  onClose,
  onIsOpenChange,
  searchableThreshold = 7,
  iconAppearance = 'right',
  hasClearIcon = false,
  ids: idsOverride,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  id,
}: SelectStateManagerProps<T>) {
  const nullTrigger = useRef<HTMLElement | null>(null)
  const [triggerRef, setTriggerRef] = useState<RefObject<HTMLElement | null>>(nullTrigger)
  const normalizedOptions = useMemo(() => normalizeSelectionOptions(options), [options])
  const optionIds = useMemo(() => normalizedOptions.map((option) => option.id), [normalizedOptions])
  const optionRefs = useOptionRefs(optionIds)
  const optionRefsRef = useRef(optionRefs)
  optionRefsRef.current = optionRefs
  const generatedId = useId()
  const ids = useMemo<SelectIds>(() => ({
    trigger: idsOverride?.trigger ?? id ?? 'select-' + generatedId,
    content: idsOverride?.content ?? 'select-content-' + generatedId,
    listbox: idsOverride?.listbox ?? 'select-listbox-' + generatedId,
    searchInput: idsOverride?.searchInput ?? 'select-search-' + generatedId,
  }), [
    generatedId,
    id,
    idsOverride?.content,
    idsOverride?.listbox,
    idsOverride?.searchInput,
    idsOverride?.trigger,
  ])

  const registerTrigger = useCallback((ref: RefObject<HTMLElement | null>) => {
    setTriggerRef(ref)
    return () => {
      setTriggerRef(nullTrigger)
    }
  }, [])

  const compare = useMemo(() => compareFunction ?? Object.is, [compareFunction])
  const seededValue = value !== undefined ? value : initialValue
  const seededId = seededValue == null
    ? null
    : normalizedOptions.find((option) => compare(option.value, seededValue))?.id ?? null

  const machine = useStateManager({
    initialState: () => createSelectState({
      options: normalizedOptions,
      selectedId: seededId,
      isOpen: initialIsOpen,
    }),
    transition: selectStateTransition<T>,
    onStateEvent,
    onStateChange: (next, transition) => {
      if (!transition) return
      const previous = transition.previousState
      const event = transition.event
      if (event.type === 'select' && next.selectedId !== previous.selectedId) {
        onValueChange?.(next.value)
      }
      if (event.type === 'clear' && next.selectedId !== previous.selectedId) {
        onValueChange?.(null)
      }
      if ((event.type === 'setOpen' || event.type === 'toggleOpen') && next.isOpen !== previous.isOpen) {
        if (!next.isOpen) onClose?.()
        onIsOpenChange?.(next.isOpen)
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

  const controlledId = useMemo(() => {
    if (value === undefined) return undefined
    if (value === null) return null
    return normalizedOptions.find((option) => compare(option.value, value))?.id ?? null
  }, [compare, normalizedOptions, value])

  useEffect(() => {
    if (controlledId === undefined) return
    dispatch({ type: 'syncSelection', id: controlledId })
  }, [controlledId, dispatch])

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

  const config: SelectContextConfig = useMemo(() => ({
    iconAppearance,
    hasClearIcon,
    ids,
  }), [iconAppearance, hasClearIcon, ids])

  const layout: SelectContextLayout = useMemo(() => ({
    triggerRef,
    registerTrigger,
  }), [triggerRef, registerTrigger])

  return (
    <SelectContext.Provider
      value={{
        isInvalid,
        isDisabled,
        isReadOnly,
        isRequired,
        selectedId: state.resolvedSelectedId,
        highlightedId: state.highlightedId,
        isOpen: state.isOpen,
        options: state.options,
        optionRefs,
        visibleOptionIds,
        idToOptionMap,
        toggleSelection: (optionId) => dispatch({ type: 'select', id: optionId }),
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
    </SelectContext.Provider>
  )
}
