import type { ReactNode } from 'react'
import { useCallback, useMemo, useState } from 'react'

import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'
import { useEventCallbackStabilizer } from '@helpwave/hightide-utils/hooks'

import { useSelect } from '../../../hooks/useSelect'
import type {
  FormFieldDataHandling,
  FormFieldInteractionStates
} from '../../../types/formField'
import {
  SelectContext,
  type SelectContextType,
  type SelectOptionType
} from './SelectContext'

export type SelectRootProps<T> = Partial<FormFieldDataHandling<T>>
  & Partial<FormFieldInteractionStates>
  & {
    value?: T | null,
    initialValue?: T | null,
    compareFunction?: (a: T | null, b: T | null) => boolean,
    initialIsOpen?: boolean,
    onClose?: () => void,
    onIsOpenChange?: (isOpen: boolean) => void,
    searchableThreshold?: number,
    color?: ColorPairToken,
    children: ReactNode,
  }

const mergeOptionMaps = <T,>(
  snapshots: Record<string, SelectOptionType<T>>,
  live: ReadonlyArray<SelectOptionType<T>>
): Record<string, SelectOptionType<T>> => {
  const merged = { ...snapshots }
  for (const option of live) {
    merged[option.value.id] = option
  }
  return merged
}

export function SelectRoot<T>({
  children,
  value,
  onValueChange,
  onEditComplete,
  initialValue,
  compareFunction,
  initialIsOpen = false,
  onClose,
  onIsOpenChange,
  searchableThreshold = 6,
  color,
  invalid = false,
  disabled = false,
  readOnly = false,
  required = false,
}: SelectRootProps<T>) {
  const [options, setOptions] = useState<SelectOptionType<T>[]>([])
  const [optionSnapshots, setOptionSnapshots] = useState<Record<string, SelectOptionType<T>>>({})

  const registerOption = useCallback((item: SelectOptionType<T>) => {
    setOptionSnapshots((previous) => ({ ...previous, [item.value.id]: item }))
    setOptions((previous) => {
      const next = previous.filter((option) => option.value.id !== item.value.id)
      next.push(item)
      return next
    })
    return () => {
      setOptions((previous) => previous.filter((option) => option.value.id !== item.value.id))
    }
  }, [])

  const compare = useMemo(() => compareFunction ?? Object.is, [compareFunction])
  const idToOptionMap = useMemo(
    () => mergeOptionMaps(optionSnapshots, options),
    [optionSnapshots, options]
  )

  const mappedValueId = useMemo(() => {
    if (value === undefined) {
      return undefined
    }
    return Object.values(idToOptionMap).find((option) => compare(option.value.value, value))?.value.id ?? null
  }, [compare, idToOptionMap, value])

  const mappedInitialValueId = useMemo(() => {
    if (initialValue === undefined) {
      return undefined
    }
    return Object.values(idToOptionMap).find((option) => compare(option.value.value, initialValue))?.value.id ?? null
  }, [compare, idToOptionMap, initialValue])

  const onValueChangeStable = useEventCallbackStabilizer(onValueChange)
  const onEditCompleteStable = useEventCallbackStabilizer(onEditComplete)
  const onIsOpenChangeStable = useEventCallbackStabilizer(onIsOpenChange)

  const onValueChangeWrapper = useCallback((id: string) => {
    const option = idToOptionMap[id]
    if (option === undefined) {
      return
    }
    onValueChangeStable(option.value.value)
  }, [idToOptionMap, onValueChangeStable])

  const onEditCompleteWrapper = useCallback((id: string) => {
    const option = idToOptionMap[id]
    if (option === undefined) {
      return
    }
    onEditCompleteStable(option.value.value)
  }, [idToOptionMap, onEditCompleteStable])

  const hookOptions = useMemo(
    () => options.map((option) => ({
      id: option.value.id,
      label: option.label,
      disabled: option.disabled,
    })),
    [options]
  )

  const state = useSelect({
    value: mappedValueId,
    initialValue: mappedInitialValueId,
    onValueChange: onValueChangeWrapper,
    onEditComplete: onEditCompleteWrapper,
    options: hookOptions,
    initialIsOpen,
    onClose,
    onIsOpenChange: onIsOpenChangeStable,
  })

  const knownOptionCount = Math.max(options.length, Object.keys(optionSnapshots).length)

  const contextValue = useMemo(() => ({
    invalid,
    disabled,
    readOnly,
    required,
    selectedId: state.value,
    highlightedId: state.highlightedValue,
    isOpen: state.isOpen,
    options,
    visibleOptionIds: state.visibleOptionIds,
    idToOptionMap,
    registerOption,
    toggleSelection: state.selectValue,
    highlightFirst: state.highlightFirst,
    highlightLast: state.highlightLast,
    highlightNext: state.highlightNext,
    highlightPrevious: state.highlightPrevious,
    highlightItem: state.highlightItem,
    handleTypeaheadKey: state.handleTypeaheadKey,
    setIsOpen: state.setIsOpen,
    toggleIsOpen: state.toggleOpen,
    config: {
      searchableThreshold,
      color,
    },
    search: {
      hasSearch: knownOptionCount >= searchableThreshold,
      searchQuery: state.searchQuery,
      setSearchQuery: state.setSearchQuery,
    },
  }), [
    color,
    disabled,
    idToOptionMap,
    invalid,
    knownOptionCount,
    options,
    readOnly,
    registerOption,
    required,
    searchableThreshold,
    state,
  ])

  return (
    <SelectContext.Provider value={contextValue as SelectContextType<unknown>}>
      {children}
    </SelectContext.Provider>
  )
}
