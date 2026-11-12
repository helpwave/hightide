import type { ReactNode } from 'react'
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { useControlledState, useStableEvent } from '@helpwave/hightide-utils/hooks'

import type { DOMInputValueProps } from '../../domInput'
import { ComboboxContext } from './ComboboxContext'
import type { ComboboxContextConfig, ComboboxContextIds, ComboboxContextLayout, ComboboxContextType, ComboboxOptionData } from './ComboboxContext'
import type { UseComboboxOptions } from './useCombobox'
import { useCombobox } from './useCombobox'
import { PopUpContext } from '../../../layout/PopUp/PopUpContext'
import type { SelectionOptionInput } from '../option'
import { normalizeSelectionOptions, scrollHighlightedOption, useOptionRefs } from '../option'

export type ComboboxEvent<T> =
  | { type: 'commit', value: T }
  | { type: 'clear' }

export interface ComboboxStateManagerProps<T = string> extends DOMInputValueProps<T | null, ComboboxEvent<T>>, Omit<UseComboboxOptions, 'options' | 'allowNewValue' | 'newValueOptionId'> {
  options: ReadonlyArray<SelectionOptionInput<T>>,
  children: ReactNode,
  onItemClick?: (value: T) => void,
  isInline?: boolean,
  isAllowingNewValue?: boolean,
  onNewValueAdded?: (value: string) => void,
  hasClearIcon?: boolean,
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
  isInline = false,
  isAllowingNewValue = false,
  onNewValueAdded,
  hasClearIcon = false,
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
  const [selectedValue, setSelectedValue] = useControlledState<T | null>({
    value,
    onValueChange: (next) => {
      onValueChangeStable(next)
    },
    defaultValue: initialValue ?? null,
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

  const combobox = useCombobox({
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
      combobox.highlightedId,
      optionRefsRef.current
    )
  }, [isOpen, combobox.highlightedId])

  const addNewValue = useCallback(() => {
    if (!isAllowingNewValue || isDisabled || isReadOnly) return
    const next = combobox.searchQuery.trim()
    if (!next) return
    onNewValueAddedStable(next)
  }, [isAllowingNewValue, isDisabled, isReadOnly, onNewValueAddedStable, combobox.searchQuery])

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
      combobox.setSearchQuery(option.label)
      setIsOpenState(false)
    },
    [isDisabled, isReadOnly, newValueId, addNewValue, idToOptionMap, setSelectedValue, onStateEventStable, onItemClickStable, combobox]
  )

  const updateSearchQuery = useCallback((query: string) => {
    combobox.setSearchQuery(query)
    if (isDisabled || isReadOnly) {
      return
    }
    setIsOpenState(true)
    const match = normalizedOptions.find((option) => !option.disabled && option.label === query)
    if (match) {
      if (!Object.is(selectedValue, match.value)) {
        setSelectedValue(match.value)
      }
      return
    }
    if (selectedValue !== null) {
      setSelectedValue(null)
    }
  }, [combobox, isDisabled, isReadOnly, normalizedOptions, selectedValue, setSelectedValue])

  const clear = useCallback(() => {
    if (isDisabled || isReadOnly) {
      return
    }
    combobox.setSearchQuery('')
    setSelectedValue(null)
    onStateEventStable?.({ type: 'clear' })
    setIsOpenState(false)
  }, [combobox, isDisabled, isReadOnly, onStateEventStable, setSelectedValue])

  const config: ComboboxContextConfig = useMemo(
    () => ({
      ids,
      setIds,
      newValueId,
      isInline,
      isAllowingNewValue,
      hasClearIcon,
    }),
    [ids, setIds, newValueId, isInline, isAllowingNewValue, hasClearIcon]
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
      searchQuery: combobox.searchQuery,
      setSearchQuery: updateSearchQuery,
    }),
    [combobox.searchQuery, updateSearchQuery]
  )

  const contextValue = useMemo(
    () => ({
      value: selectedValue,
      isInvalid,
      isDisabled,
      isReadOnly,
      isRequired,
      isOpen,
      highlightedId: combobox.highlightedId,
      options: normalizedOptions,
      optionRefs,
      visibleOptionIds: combobox.visibleOptionIds,
      idToOptionMap,
      selectOption,
      addNewValue,
      clear,
      highlightFirst: combobox.highlightFirst,
      highlightLast: combobox.highlightLast,
      highlightNext: combobox.highlightNext,
      highlightPrevious: combobox.highlightPrevious,
      highlightItem: combobox.highlightItem,
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
      combobox.highlightedId,
      combobox.visibleOptionIds,
      combobox.highlightFirst,
      combobox.highlightLast,
      combobox.highlightNext,
      combobox.highlightPrevious,
      combobox.highlightItem,
      normalizedOptions,
      optionRefs,
      idToOptionMap,
      selectOption,
      addNewValue,
      clear,
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
          state: { isOpen },
          dispatch: (event) => {
            if (event.type === 'open') {
              setIsOpen(true)
              return
            }
            if (event.type === 'close') {
              setIsOpen(false)
              return
            }
            if (event.type === 'toggle') {
              setIsOpen(!isOpen)
              return
            }
          },
          popUpId: ids.popup,
          triggerId: ids.trigger,
          triggerRef: searchbarRef,
        }}
      >
        {children}
      </PopUpContext.Provider>
    </ComboboxContext.Provider>
  )
}
