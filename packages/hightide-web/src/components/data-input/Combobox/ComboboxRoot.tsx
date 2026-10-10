import type { ReactNode, RefObject } from 'react'
import { useCallback, useId, useMemo, useState } from 'react'
import { useControlledState, useStableEvent } from '@helpwave/hightide-utils/hooks'

import type { InputComponentInterface } from '../input/TextInput'
import { DOMUtils } from '../../../utils/dom'
import { ComboboxContext } from './ComboboxContext'
import type { ComboboxContextConfig, ComboboxContextIds, ComboboxContextLayout, ComboboxContextType, ComboboxOptionType } from './ComboboxContext'
import type { UseComboboxOptions } from './useCombobox'
import { useCombobox } from './useCombobox'

export interface ComboboxRootProps<T = string> extends InputComponentInterface<T>, Omit<UseComboboxOptions, 'options'> {
  children: ReactNode,
  onItemClick?: (value: T) => void,
}

export function ComboboxRoot<T = string>({
  children,
  value,
  initialValue,
  onValueUpdate: onValueChange,
  onValueCommit: onEditComplete,
  invalid = false,
  disabled = false,
  readOnly = false,
  required = false,
  onItemClick,
  ...hookProps
}: ComboboxRootProps<T>) {
  const [options, setOptions] = useState<ComboboxOptionType<T>[]>([])
  const [listRef, setListRef] = useState<RefObject<HTMLUListElement | null> | null>(null)
  const generatedId = useId()
  const [ids, setIds] = useState<ComboboxContextIds>({
    trigger: `combobox-${generatedId}`,
    listbox: `combobox-${generatedId}-listbox`,
  })
  const onValueChangeStable = useStableEvent(onValueChange)
  const onEditCompleteStable = useStableEvent(onEditComplete)
  const onItemClickStable = useStableEvent(onItemClick)
  const [selectedValue, setSelectedValue] = useControlledState<T | undefined>({
    value,
    onValueChange: (next) => {
      if (next !== undefined) {
        onValueChangeStable(next)
      }
    },
    defaultValue: initialValue,
  })

  const registerOption = useCallback(
    (option: ComboboxOptionType<T>) => {
      setOptions((prev) => {
        const next = prev.filter((o) => o.id !== option.id)
        next.push(option)
        next.sort((a, b) =>
          DOMUtils.compareDocumentPosition(a.ref.current, b.ref.current))
        return next
      })
      return () =>
        setOptions((prev) => prev.filter((o) => o.id !== option.id))
    },
    []
  )

  const registerList = useCallback((ref: RefObject<HTMLUListElement | null>) => {
    setListRef(() => ref)
    return () => setListRef(null)
  }, [])

  const hookOptions = useMemo(
    () =>
      options.map((o) => ({
        id: o.id,
        label: o.label,
        disabled: o.disabled,
      })),
    [options]
  )

  const state = useCombobox({ ...hookProps, options: hookOptions })

  const idToOptionMap = useMemo(() => {
    return options.reduce((acc, o) => {
      acc[o.id] = o
      return acc
    }, {} as Record<string, ComboboxOptionType<T>>)
  }, [options])

  const selectOption = useCallback(
    (id: string) => {
      if (disabled || readOnly) {
        return
      }
      const option = idToOptionMap[id]
      if (!option || option.disabled) {
        return
      }
      setSelectedValue(option.value)
      onEditCompleteStable(option.value)
      onItemClickStable(option.value)
      state.setSearchQuery(option.label ?? '')
    },
    [disabled, readOnly, idToOptionMap, setSelectedValue, onEditCompleteStable, onItemClickStable, state]
  )

  const config: ComboboxContextConfig = useMemo(
    () => ({ ids, setIds }),
    [ids, setIds]
  )

  const layout: ComboboxContextLayout = useMemo(
    () => ({
      listRef: listRef ?? { current: null },
      registerList,
    }),
    [listRef, registerList]
  )

  const search = useMemo(
    () => ({
      searchQuery: state.searchQuery,
      setSearchQuery: state.setSearchQuery,
    }),
    [state.searchQuery, state.setSearchQuery]
  )

  const contextValue = useMemo(
    () => ({
      value: selectedValue,
      invalid,
      disabled,
      readOnly,
      required,
      highlightedId: state.highlightedId,
      options,
      visibleOptionIds: state.visibleOptionIds,
      idToOptionMap,
      registerOption,
      selectOption,
      highlightFirst: state.highlightFirst,
      highlightLast: state.highlightLast,
      highlightNext: state.highlightNext,
      highlightPrevious: state.highlightPrevious,
      highlightItem: state.highlightItem,
      config,
      layout,
      search,
    }),
    [
      selectedValue,
      invalid,
      disabled,
      readOnly,
      required,
      state.highlightedId,
      state.visibleOptionIds,
      state.highlightFirst,
      state.highlightLast,
      state.highlightNext,
      state.highlightPrevious,
      state.highlightItem,
      options,
      idToOptionMap,
      registerOption,
      selectOption,
      config,
      layout,
      search,
    ]
  )

  return (
    <ComboboxContext.Provider value={contextValue as ComboboxContextType<unknown>}>
      {children}
    </ComboboxContext.Provider>
  )
}
