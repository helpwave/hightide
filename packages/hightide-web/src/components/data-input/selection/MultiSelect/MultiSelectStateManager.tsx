import type { ReactNode, RefObject, SetStateAction } from 'react'
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { MultiSelectContext } from './MultiSelectContext'
import type { MultiSelectContextType, MultiSelectIconAppearance, MultiSelectOptionData } from './MultiSelectContext'
import { useMultiSelect } from './useMultiSelect'
import type { ControllableDOMInputProps } from '../../domInput'
import { PopUpContext } from '../../../layout/PopUp/PopUpContext'
import type { SelectionOptionInput } from '../option'
import { normalizeSelectionOptions, scrollHighlightedOption, useOptionRefs } from '../option'

export interface MultiSelectIds {
  trigger: string,
  content: string,
  listbox: string,
  searchInput: string,
}

export type MultiSelectEvent<T> = { type: 'commit', value: T[] }

export interface MultiSelectStateManagerProps<T> extends ControllableDOMInputProps<T[], MultiSelectEvent<T>> {
  options: ReadonlyArray<SelectionOptionInput<T>>,
  compareFunction?: (a: T, b: T) => boolean,
  initialIsOpen?: boolean,
  onClose?: () => void,
  searchableThreshold?: number,
  iconAppearance?: MultiSelectIconAppearance,
  children: ReactNode,
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
  searchableThreshold = 6,
  iconAppearance = 'right',
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  id,
}: MultiSelectStateManagerProps<T>) {
  const nullTrigger = useRef<HTMLElement | null>(null)
  const [triggerRef, setTriggerRef] = useState<RefObject<HTMLElement | null>>(nullTrigger)
  const normalizedOptions = useMemo(() => normalizeSelectionOptions(options), [options])
  const optionIds = useMemo(() => normalizedOptions.map((option) => option.id), [normalizedOptions])
  const optionRefs = useOptionRefs(optionIds)
  const optionRefsRef = useRef(optionRefs)
  optionRefsRef.current = optionRefs
  const generatedId = useId()
  const [ids, setIds] = useState<MultiSelectIds>({
    trigger: id ?? 'multi-select-' + generatedId,
    content: 'multi-select-content-' + generatedId,
    listbox: 'multi-select-listbox-' + generatedId,
    searchInput: 'multi-select-search-' + generatedId,
  })

  useEffect(() => {
    if (!id) return
    setIds((prev) => (prev.trigger === id ? prev : { ...prev, trigger: id }))
  }, [id])

  const registerTrigger = useCallback((ref: RefObject<HTMLElement | null>) => {
    setTriggerRef(ref)
    return () => setTriggerRef(nullTrigger)
  }, [])

  const compare = useMemo(() => compareFunction ?? Object.is, [compareFunction])

  const idToOptionMap = useMemo(
    () =>
      normalizedOptions.reduce(
        (acc, option) => {
          acc[option.id] = option
          return acc
        },
        {} as Record<string, MultiSelectOptionData<T>>
      ),
    [normalizedOptions]
  )

  const mappedValueIds = useMemo(() => {
    if (value === undefined) return undefined
    return value
      .map((item) => normalizedOptions.find((option) => compare(option.value, item))?.id)
      .filter((id) => id !== undefined)
  }, [normalizedOptions, value, compare])

  const mappedInitialValueIds = useMemo(() => {
    if (initialValue === undefined) return []
    return initialValue
      .map((item) => normalizedOptions.find((option) => compare(option.value, item))?.id)
      .filter((id) => id !== undefined)
  }, [normalizedOptions, initialValue, compare])

  const onValueChangeStable = useCallback(
    (ids: string[]) => {
      const values = ids
        .map((id) => idToOptionMap[id]?.value)
        .filter((item): item is T => item !== undefined)
      onValueChange?.(values)
    },
    [idToOptionMap, onValueChange]
  )

  const onEditCompleteStable = useCallback(
    (ids: string[]) => {
      const values = ids
        .map((id) => idToOptionMap[id]?.value)
        .filter((item): item is T => item !== undefined)
      onStateEvent?.({ type: 'commit', value: values })
    },
    [idToOptionMap, onStateEvent]
  )

  const state = useMultiSelect({
    options: normalizedOptions.map((option) => ({ id: option.id, label: option.label, disabled: option.disabled })),
    value: mappedValueIds,
    onValueChange: onValueChangeStable,
    onEditComplete: onEditCompleteStable,
    initialValue: mappedInitialValueIds,
    initialIsOpen,
    onClose,
  })
  const { setSearchQuery } = state
  const hasSearch = normalizedOptions.length >= searchableThreshold

  useEffect(() => {
    if (!hasSearch) {
      setSearchQuery('')
    }
  }, [hasSearch, setSearchQuery])

  useEffect(() => {
    scrollHighlightedOption(
      state.highlightedId,
      optionRefsRef.current,
      ids.listbox,
      hasSearch ? ids.searchInput : undefined
    )
  }, [hasSearch, ids.listbox, ids.searchInput, state.highlightedId, state.isOpen])

  const contextValue = useMemo((): MultiSelectContextType<T> => {
    const valueT = state.value
      .map((id) => idToOptionMap[id]?.value)
      .filter((item): item is T => item !== undefined)
    return {
      isInvalid,
      isDisabled,
      isReadOnly,
      isRequired,
      selectedIds: state.value,
      highlightedId: state.highlightedId,
      isOpen: state.isOpen,
      options: normalizedOptions,
      optionRefs,
      visibleOptionIds: state.visibleOptionIds,
      idToOptionMap,
      value: valueT,
      toggleSelection: state.toggleSelection,
      highlightFirst: state.highlightFirst,
      highlightLast: state.highlightLast,
      highlightNext: state.highlightNext,
      highlightPrevious: state.highlightPrevious,
      highlightItem: state.highlightItem,
      handleTypeaheadKey: state.handleTypeaheadKey,
      setIsOpen: state.setIsOpen,
      toggleIsOpen: state.toggleOpen,
      config: {
        iconAppearance,
        ids,
        setIds,
      },
      layout: {
        triggerRef,
        registerTrigger,
      },
      search: {
        hasSearch,
        searchQuery: state.searchQuery,
        setSearchQuery: state.setSearchQuery,
      },
    }
  }, [
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
    state,
    normalizedOptions,
    optionRefs,
    idToOptionMap,
    iconAppearance,
    ids,
    triggerRef,
    registerTrigger,
    hasSearch,
  ])

  const setIsOpen = useCallback((updater: SetStateAction<boolean>) => {
    if (typeof updater === 'function') {
      state.setIsOpen(updater(state.isOpen))
    } else {
      state.setIsOpen(updater)
    }
  }, [state])

  return (
    <MultiSelectContext.Provider value={contextValue as MultiSelectContextType<unknown>}>
      <PopUpContext.Provider
        value={{
          isOpen: state.isOpen,
          setIsOpen,
          popUpId: ids.content,
          triggerId: ids.trigger,
          triggerRef,
          setTriggerRef,
        }}
      >
        {children}
      </PopUpContext.Provider>
    </MultiSelectContext.Provider>
  )
}
