import type { ReactNode, RefObject, SetStateAction } from 'react'
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { SelectContext } from './SelectContext'
import type { SelectContextConfig, SelectContextLayout } from './SelectContext'
import { useSelect } from './useSelect'
import type { ControllableDOMInputProps } from '../../domInput'
import { useStableEvent } from '@helpwave/hightide-utils/hooks'
import { PopUpContext } from '../../../layout/PopUp/PopUpContext'
import type { SelectionOptionInput } from '../option'
import { normalizeSelectionOptions, scrollHighlightedOption, useOptionRefs } from '../option'

export interface SelectIds {
  trigger: string,
  content: string,
  listbox: string,
  searchInput: string,
}

export type SelectEvent<T> = { type: 'commit', value: T }

export interface SelectStateManagerProps<T> extends ControllableDOMInputProps<T, SelectEvent<T>> {
  options: ReadonlyArray<SelectionOptionInput<T>>,
  compareFunction?: (a: T, b: T) => boolean,
  initialIsOpen?: boolean,
  onClose?: () => void,
  onIsOpenChange?: (isOpen: boolean) => void,
  searchableThreshold?: number,
  iconAppearance?: 'left' | 'right' | 'none',
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
  searchableThreshold = 6,
  iconAppearance = 'right',
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
  const [ids, setIds] = useState<SelectIds>({
    trigger: id ?? 'select-' + generatedId,
    content: 'select-content-' + generatedId,
    listbox: 'select-listbox-' + generatedId,
    searchInput: 'select-search-' + generatedId,
  })

  useEffect(() => {
    if (!id) return
    setIds((prev) => (prev.trigger === id ? prev : { ...prev, trigger: id }))
  }, [id])

  const registerTrigger = useCallback((ref: RefObject<HTMLElement | null>) => {
    setTriggerRef(ref)
    return () => {
      setTriggerRef(nullTrigger)
    }
  }, [])

  const compare = useMemo(() => compareFunction ?? Object.is, [compareFunction])

  const idToOptionMap = useMemo(() => {
    return normalizedOptions.reduce((acc, option) => {
      acc[option.id] = option
      return acc
    }, {} as Record<string, typeof normalizedOptions[number]>)
  }, [normalizedOptions])

  const mappedValueId = useMemo(() => {
    if (value === undefined) return undefined
    return normalizedOptions.find((option) => compare(option.value, value))?.id
  }, [normalizedOptions, value, compare])

  const mappedInitialValueId = useMemo(() => {
    if (initialValue === undefined) return undefined
    return normalizedOptions.find((option) => compare(option.value, initialValue))?.id
  }, [normalizedOptions, initialValue, compare])

  const onValueChangeStable = useStableEvent(onValueChange)
  const onStateEventStable = useStableEvent(onStateEvent)
  const onIsOpenChangeStable = useStableEvent(onIsOpenChange)

  const onValueChangeWrapper = useCallback((nextId: string) => {
    const option = idToOptionMap[nextId]
    if (option === undefined) {
      console.warn(`Attempted to select an option ${nextId} that is not valid`)
      return
    }
    onValueChangeStable(option.value)
  }, [onValueChangeStable, idToOptionMap])

  const onEditCompleteWrapper = useCallback((nextId: string) => {
    const option = idToOptionMap[nextId]
    if (option === undefined) {
      console.warn(`Attempted to edit complete an option ${nextId} that is not valid`)
      return
    }
    onStateEventStable?.({ type: 'commit', value: option.value })
  }, [onStateEventStable, idToOptionMap])

  const state = useSelect({
    value: value !== undefined && mappedValueId === undefined ? null : mappedValueId,
    initialValue: initialValue !== undefined && mappedInitialValueId === undefined ? null : mappedInitialValueId,
    onValueChange: onValueChangeWrapper,
    onEditComplete: onEditCompleteWrapper,
    options: normalizedOptions.map((option) => ({
      id: option.id,
      label: option.label,
      disabled: option.disabled,
    })),
    initialIsOpen,
    onClose,
    onIsOpenChange: onIsOpenChangeStable,
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
      state.highlightedValue ?? null,
      optionRefsRef.current,
      ids.listbox,
      hasSearch ? ids.searchInput : undefined
    )
  }, [hasSearch, ids.listbox, ids.searchInput, state.highlightedValue, state.isOpen])

  const config: SelectContextConfig = useMemo(() => ({
    iconAppearance,
    ids,
    setIds,
  }), [iconAppearance, ids, setIds])

  const layout: SelectContextLayout = useMemo(() => ({
    triggerRef,
    registerTrigger,
  }), [triggerRef, registerTrigger])

  const setIsOpen = useCallback((updater: SetStateAction<boolean>) => {
    if (typeof updater === 'function') {
      state.setIsOpen(updater(state.isOpen))
    } else {
      state.setIsOpen(updater)
    }
  }, [state])

  return (
    <SelectContext.Provider
      value={{
        isInvalid,
        isDisabled,
        isReadOnly,
        isRequired,
        selectedId: state.value,
        highlightedId: state.highlightedValue ?? null,
        isOpen: state.isOpen,
        options: normalizedOptions,
        optionRefs,
        visibleOptionIds: state.visibleOptionIds,
        idToOptionMap,
        toggleSelection: state.selectValue,
        highlightFirst: state.highlightFirst,
        highlightLast: state.highlightLast,
        highlightNext: state.highlightNext,
        highlightPrevious: state.highlightPrevious,
        highlightItem: state.highlightItem,
        handleTypeaheadKey: state.handleTypeaheadKey,
        setIsOpen: state.setIsOpen,
        toggleIsOpen: state.toggleOpen,
        config,
        layout,
        search: {
          hasSearch,
          searchQuery: state.searchQuery,
          setSearchQuery: state.setSearchQuery,
        },
      }}
    >
      <PopUpContext.Provider
        value={{
          isOpen: state.isOpen,
          setIsOpen: setIsOpen,
          popUpId: ids.content,
          triggerId: ids.trigger,
          triggerRef,
          setTriggerRef,
        }}
      >
        {children}
      </PopUpContext.Provider>
    </SelectContext.Provider>
  )
}
