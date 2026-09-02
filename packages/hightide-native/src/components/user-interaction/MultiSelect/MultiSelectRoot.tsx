import type { ReactNode } from 'react'
import { useCallback, useMemo, useState } from 'react'

import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'
import { useEventCallbackStabilizer } from '@helpwave/hightide-utils/hooks'

import { useMultiSelect } from '../../../hooks/useMultiSelect'
import type {
  FormFieldDataHandling,
  FormFieldInteractionStates
} from '../../../types/formField'
import {
  MultiSelectContext,
  type MultiSelectContextType,
  type MultiSelectOptionType
} from './MultiSelectContext'

export type MultiSelectRootProps<T> = Partial<FormFieldDataHandling<T[]>>
  & Partial<FormFieldInteractionStates>
  & {
    value?: T[],
    initialValue?: T[],
    compareFunction?: (a: T, b: T) => boolean,
    initialIsOpen?: boolean,
    onClose?: () => void,
    searchableThreshold?: number,
    color?: ColorPairToken,
    children: ReactNode,
  }

const mergeOptionMaps = <T,>(
  snapshots: Record<string, MultiSelectOptionType<T>>,
  live: ReadonlyArray<MultiSelectOptionType<T>>
): Record<string, MultiSelectOptionType<T>> => {
  const merged = { ...snapshots }
  for (const option of live) {
    merged[option.value.id] = option
  }
  return merged
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
  color,
  invalid = false,
  disabled = false,
  readOnly = false,
  required = false,
}: MultiSelectRootProps<T>) {
  const [options, setOptions] = useState<MultiSelectOptionType<T>[]>([])
  const [optionSnapshots, setOptionSnapshots] = useState<Record<string, MultiSelectOptionType<T>>>({})

  const registerOption = useCallback((item: MultiSelectOptionType<T>) => {
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

  const mappedValueIds = useMemo(() => {
    if (value == null) {
      return undefined
    }
    const known = Object.values(idToOptionMap)
    return value
      .map((item) => known.find((option) => compare(option.value.value, item))?.value.id)
      .filter((id): id is string => id !== undefined)
  }, [compare, idToOptionMap, value])

  const mappedInitialValueIds = useMemo(() => {
    if (initialValue == null) {
      return []
    }
    const known = Object.values(idToOptionMap)
    return initialValue
      .map((item) => known.find((option) => compare(option.value.value, item))?.value.id)
      .filter((id): id is string => id !== undefined)
  }, [compare, idToOptionMap, initialValue])

  const onValueChangeStable = useEventCallbackStabilizer(onValueChange)
  const onEditCompleteStable = useEventCallbackStabilizer(onEditComplete)

  const onValueChangeWrapper = useCallback((ids: string[]) => {
    const values = ids
      .map((id) => idToOptionMap[id]?.value.value)
      .filter((item): item is T => item != null)
    onValueChangeStable(values)
  }, [idToOptionMap, onValueChangeStable])

  const onEditCompleteWrapper = useCallback((ids: string[]) => {
    const values = ids
      .map((id) => idToOptionMap[id]?.value.value)
      .filter((item): item is T => item != null)
    onEditCompleteStable(values)
  }, [idToOptionMap, onEditCompleteStable])

  const hookOptions = useMemo(
    () => options.map((option) => ({
      id: option.value.id,
      label: option.label,
      disabled: option.disabled,
    })),
    [options]
  )

  const state = useMultiSelect({
    options: hookOptions,
    value: mappedValueIds,
    onValueChange: onValueChangeWrapper,
    onEditComplete: onEditCompleteWrapper,
    initialValue: mappedInitialValueIds,
    initialIsOpen,
    onClose,
  })

  const knownOptionCount = Math.max(options.length, Object.keys(optionSnapshots).length)
  const selectedValues = useMemo(
    () => state.value
      .map((id) => idToOptionMap[id]?.value.value)
      .filter((item): item is T => item != null),
    [idToOptionMap, state.value]
  )

  const contextValue = useMemo((): MultiSelectContextType<T> => ({
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
    value: selectedValues,
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
    selectedValues,
    state,
  ])

  return (
    <MultiSelectContext.Provider value={contextValue as MultiSelectContextType<unknown>}>
      {children}
    </MultiSelectContext.Provider>
  )
}
