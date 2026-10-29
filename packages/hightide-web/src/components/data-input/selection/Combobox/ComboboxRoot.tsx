import type { ReactNode, RefObject } from 'react'
import { useCallback, useId, useMemo, useState } from 'react'
import { useControlledState, useStableEvent } from '@helpwave/hightide-utils/hooks'

import type { ControllableInputProps } from '@helpwave/hightide-utils/interfaces'
import { DOMUtils } from '../../../../utils/dom'
import { ComboboxContext } from './ComboboxContext'
import type { ComboboxContextConfig, ComboboxContextIds, ComboboxContextLayout, ComboboxContextType, ComboboxOptionType } from './ComboboxContext'
import type { UseComboboxOptions } from './useCombobox'
import { useCombobox } from './useCombobox'

export type ComboboxEvent<T> = { type: 'commit', value: T }

export interface ComboboxRootProps<T = string> extends ControllableInputProps<T, ComboboxEvent<T>>, Omit<UseComboboxOptions, 'options'> {
  children: ReactNode,
  onItemClick?: (value: T) => void,
}

export function ComboboxRoot<T = string>({
  children,
  value,
  initialValue,
  onValueChange,
  onStateEvent,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
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
  const onStateEventStable = useStableEvent(onStateEvent)
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
      if (isDisabled || isReadOnly) {
        return
      }
      const option = idToOptionMap[id]
      if (!option || option.disabled) {
        return
      }
      setSelectedValue(option.value)
      onStateEventStable?.({ type: 'commit', value: option.value })
      onItemClickStable(option.value)
      state.setSearchQuery(option.label ?? '')
    },
    [isDisabled, isReadOnly, idToOptionMap, setSelectedValue, onStateEventStable, onItemClickStable, state]
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
      isInvalid,
      isDisabled,
      isReadOnly,
      isRequired,
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
      isInvalid,
      isDisabled,
      isReadOnly,
      isRequired,
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
