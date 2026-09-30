import type { ReactNode, RefObject, SetStateAction } from 'react'
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { MultiSelectContext } from './MultiSelectContext'
import type { MultiSelectContextType, MultiSelectIconAppearance, MultiSelectOptionType } from './MultiSelectContext'
import { useMultiSelect } from './useMultiSelect'
import { DOMUtils } from '../../../utils/dom'
import type { InputInterface } from '../input/Input'
import { PopUpContext } from '../../layout/popup/PopUpContext'

export interface MultiSelectIds {
  trigger: string,
  content: string,
  listbox: string,
  searchInput: string,
}

export interface MultiSelectRootProps<T> extends InputInterface<T[]> {
  compareFunction?: (a: T, b: T) => boolean,
  initialIsOpen?: boolean,
  onClose?: () => void,
  searchableThreshold?: number,
  iconAppearance?: MultiSelectIconAppearance,
  children: ReactNode,
}

export function MultiSelectRoot<T>({
  children,
  value,
  onValueChange,
  onEditComplete,
  initialValue,
  compareFunction,
  initialIsOpen = false,
  onClose,
  searchableThreshold = 6,
  iconAppearance = 'right',
  invalid = false,
  disabled = false,
  readOnly = false,
  required = false,
}: MultiSelectRootProps<T>) {
  const nullTrigger = useRef<HTMLElement | null>(null)
  const [triggerRef, setTriggerRef] = useState<RefObject<HTMLElement | null>>(nullTrigger)
  const [options, setOptions] = useState<MultiSelectOptionType<T>[]>([])
  const [optionSnapshots, setOptionSnapshots] = useState<Record<string, MultiSelectOptionType<T>>>({})
  const generatedId = useId()
  const [ids, setIds] = useState<MultiSelectIds>({
    trigger: 'multi-select-' + generatedId,
    content: 'multi-select-content-' + generatedId,
    listbox: 'multi-select-listbox-' + generatedId,
    searchInput: 'multi-select-search-' + generatedId,
  })

  const registerOption = useCallback((item: MultiSelectOptionType<T>) => {
    setOptionSnapshots((previous) => ({ ...previous, [item.value.id]: item }))
    setOptions((prev) => {
      const next = prev.filter((o) => o.value.id !== item.value.id)
      next.push(item)
      next.sort((a, b) =>
        DOMUtils.compareDocumentPosition(a.ref.current, b.ref.current))
      return next
    })
    return () => setOptions((prev) => prev.filter((o) => o.value.id !== item.value.id))
  }, [])

  const registerTrigger = useCallback((ref: RefObject<HTMLElement | null>) => {
    setTriggerRef(ref)
    return () => setTriggerRef(nullTrigger)
  }, [])

  const compare = useMemo(() => compareFunction ?? Object.is, [compareFunction])

  const idToOptionMap = useMemo(
    () =>
      options.reduce(
        (acc, o) => {
          acc[o.value.id] = o
          return acc
        },
        {} as Record<string, MultiSelectOptionType<T>>
      ),
    [options]
  )

  const mappedValueIds = useMemo(() => {
    if (value === undefined) return undefined
    return value
      .map((v) => options.find((o) => compare(o.value.value, v))?.value.id)
      .filter((id) => id !== undefined)
  }, [options, value, compare])

  const mappedInitialValueIds = useMemo(() => {
    if (initialValue === undefined) return []
    return initialValue
      .map((v) => options.find((o) => compare(o.value.value, v))?.value.id)
      .filter((id) => id !== undefined)
  }, [options, initialValue, compare])

  const onValueChangeStable = useCallback(
    (ids: string[]) => {
      const values = ids
        .map((id) => idToOptionMap[id]?.value.value)
        .filter((value): value is T => value !== undefined)
      onValueChange?.(values)
    },
    [idToOptionMap, onValueChange]
  )

  const onEditCompleteStable = useCallback(
    (ids: string[]) => {
      const values = ids
        .map((id) => idToOptionMap[id]?.value.value)
        .filter((value): value is T => value !== undefined)
      onEditComplete?.(values)
    },
    [idToOptionMap, onEditComplete]
  )

  const state = useMultiSelect({
    options: options.map((o) => ({ id: o.value.id, label: o.label, disabled: o.disabled })),
    value: mappedValueIds,
    onValueChange: onValueChangeStable,
    onEditComplete: onEditCompleteStable,
    initialValue: mappedInitialValueIds,
    initialIsOpen,
    onClose,
  })
  const { setSearchQuery } = state
  const knownOptionCount = Math.max(options.length, Object.keys(optionSnapshots).length)
  const hasSearch = knownOptionCount >= searchableThreshold

  useEffect(() => {
    if (!hasSearch) {
      setSearchQuery('')
    }
  }, [hasSearch, setSearchQuery])

  const contextValue = useMemo((): MultiSelectContextType<T> => {
    const valueT = state.value
      .map((id) => idToOptionMap[id]?.value.value)
      .filter((value): value is T => value !== undefined)
    return {
      invalid,
      disabled,
      readOnly,
      required,
      selectedIds: state.value,
      highlightedId: state.highlightedId,
      isOpen: state.isOpen,
      options,
      visibleOptionIds: state.visibleOptionIds,
      idToOptionMap,
      value: valueT,
      registerOption,
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
    invalid,
    disabled,
    readOnly,
    required,
    state,
    options,
    idToOptionMap,
    registerOption,
    iconAppearance,
    ids,
    triggerRef,
    registerTrigger,
    hasSearch,
  ])

  const setIsOpen = useCallback((updater: SetStateAction<boolean>) => {
    if(typeof updater === 'function') {
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
