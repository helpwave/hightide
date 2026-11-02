import type { ReactNode } from 'react'
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { useControlledState, useStableEvent } from '@helpwave/hightide-utils/hooks'

import type { ControllableDOMInputProps } from '../../domInput'
import { ComboboxContext } from './ComboboxContext'
import type { ComboboxContextConfig, ComboboxContextIds, ComboboxContextLayout, ComboboxContextType, ComboboxOptionData } from './ComboboxContext'
import type { UseComboboxOptions } from './useCombobox'
import { useCombobox } from './useCombobox'
import { PopUpContext } from '../../../layout/PopUp/PopUpContext'
import type { SelectionOptionInput } from '../option'
import { normalizeSelectionOptions, scrollHighlightedOption, useOptionRefs } from '../option'

export type ComboboxEvent<T> = { type: 'commit', value: T }

export interface ComboboxStateManagerProps<T = string> extends ControllableDOMInputProps<T, ComboboxEvent<T>>, Omit<UseComboboxOptions, 'options' | 'allowNewValue' | 'newValueOptionId'> {
  options: ReadonlyArray<SelectionOptionInput<T>>,
  children: ReactNode,
  onItemClick?: (value: T) => void,
  isAllowingNewValue?: boolean,
  onNewValueAdded?: (value: string) => void,
}

export function ComboboxStateManager<T = string>({
  children,
  options,
  value,
  initialValue,
  onValueChange,
  onStateEvent,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  id,
  onItemClick,
  isAllowingNewValue = false,
  onNewValueAdded,
  ...hookProps
}: ComboboxStateManagerProps<T>) {
  const normalizedOptions = useMemo(() => normalizeSelectionOptions(options), [options])
  const listRef = useRef<HTMLUListElement | null>(null)
  const searchbarRef = useRef<HTMLInputElement | null>(null)
  const generatedId = useId()
  const newValueId = `combobox-new-value-${generatedId}`
  const optionIds = useMemo(
    () => [...normalizedOptions.map((option) => option.id), newValueId],
    [normalizedOptions, newValueId]
  )
  const optionRefs = useOptionRefs(optionIds)
  const optionRefsRef = useRef(optionRefs)
  optionRefsRef.current = optionRefs
  const [ids, setIds] = useState<ComboboxContextIds>({
    trigger: id ?? `combobox-${generatedId}`,
    listbox: `combobox-${generatedId}-listbox`,
    popup: `combobox-${generatedId}-popup`,
  })

  useEffect(() => {
    if (!id) return
    setIds((prev) => (prev.trigger === id ? prev : { ...prev, trigger: id }))
  }, [id])

  const [isOpen, setIsOpenState] = useState(false)
  const onValueChangeStable = useStableEvent(onValueChange)
  const onStateEventStable = useStableEvent(onStateEvent)
  const onItemClickStable = useStableEvent(onItemClick)
  const onNewValueAddedStable = useStableEvent(onNewValueAdded)
  const [selectedValue, setSelectedValue] = useControlledState<T | undefined>({
    value,
    onValueChange: (next) => {
      if (next !== undefined) {
        onValueChangeStable(next)
      }
    },
    defaultValue: initialValue,
  })

  const setIsOpen = useCallback((open: boolean) => {
    setIsOpenState(open)
  }, [])

  const hookOptions = useMemo(
    () =>
      normalizedOptions.map((option) => ({
        id: option.id,
        label: option.label,
        disabled: option.disabled,
      })),
    [normalizedOptions]
  )

  const state = useCombobox({
    ...hookProps,
    options: hookOptions,
    allowNewValue: isAllowingNewValue && !isDisabled && !isReadOnly,
    newValueOptionId: newValueId,
  })

  const idToOptionMap = useMemo(() => {
    return normalizedOptions.reduce((acc, option) => {
      acc[option.id] = option
      return acc
    }, {} as Record<string, ComboboxOptionData<T>>)
  }, [normalizedOptions])

  useEffect(() => {
    scrollHighlightedOption(
      state.highlightedId,
      optionRefsRef.current,
      ids.listbox,
      ids.trigger
    )
  }, [ids.listbox, ids.trigger, isOpen, state.highlightedId])

  const addNewValue = useCallback(() => {
    if (!isAllowingNewValue || isDisabled || isReadOnly) return
    const next = state.searchQuery.trim()
    if (!next) return
    onNewValueAddedStable(next)
  }, [isAllowingNewValue, isDisabled, isReadOnly, onNewValueAddedStable, state.searchQuery])

  const selectOption = useCallback(
    (id: string) => {
      if (isDisabled || isReadOnly) {
        return
      }
      if (id === newValueId) {
        addNewValue()
        return
      }
      const option = idToOptionMap[id]
      if (!option || option.disabled) {
        return
      }
      setSelectedValue(option.value)
      onStateEventStable?.({ type: 'commit', value: option.value })
      onItemClickStable(option.value)
      state.setSearchQuery(option.label)
      setIsOpenState(false)
    },
    [isDisabled, isReadOnly, newValueId, addNewValue, idToOptionMap, setSelectedValue, onStateEventStable, onItemClickStable, state]
  )

  const config: ComboboxContextConfig = useMemo(
    () => ({
      ids,
      setIds,
      newValueId,
      isAllowingNewValue,
    }),
    [ids, setIds, newValueId, isAllowingNewValue]
  )

  const layout: ComboboxContextLayout = useMemo(
    () => ({
      listRef,
      searchbarRef,
    }),
    [listRef, searchbarRef]
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
      isOpen,
      highlightedId: state.highlightedId,
      options: normalizedOptions,
      optionRefs,
      visibleOptionIds: state.visibleOptionIds,
      idToOptionMap,
      selectOption,
      addNewValue,
      highlightFirst: state.highlightFirst,
      highlightLast: state.highlightLast,
      highlightNext: state.highlightNext,
      highlightPrevious: state.highlightPrevious,
      highlightItem: state.highlightItem,
      setIsOpen,
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
      isOpen,
      state.highlightedId,
      state.visibleOptionIds,
      state.highlightFirst,
      state.highlightLast,
      state.highlightNext,
      state.highlightPrevious,
      state.highlightItem,
      normalizedOptions,
      optionRefs,
      idToOptionMap,
      selectOption,
      addNewValue,
      setIsOpen,
      config,
      layout,
      search,
    ]
  )

  return (
    <ComboboxContext.Provider value={contextValue as ComboboxContextType<unknown>}>
      <PopUpContext.Provider
        value={{
          isOpen,
          setIsOpen: (updater) => {
            setIsOpenState((current) => typeof updater === 'function' ? updater(current) : updater)
          },
          popUpId: ids.popup,
          triggerId: ids.trigger,
          triggerRef: searchbarRef,
          setTriggerRef: () => {},
        }}
      >
        {children}
      </PopUpContext.Provider>
    </ComboboxContext.Provider>
  )
}
