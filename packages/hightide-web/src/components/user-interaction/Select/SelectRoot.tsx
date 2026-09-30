import type { ReactNode, RefObject, SetStateAction } from 'react'
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { SelectContext } from './SelectContext'
import type { SelectContextConfig, SelectContextLayout, SelectOptionType } from './SelectContext'
import { useSelect } from './useSelect'
import { DOMUtils } from '../../../utils/dom'
import type { FormFieldDataHandling } from '../../form/FormField'
import { useEventCallbackStabilizer } from '@helpwave/hightide-utils/hooks'
import type { FormFieldInteractionStates } from '../../form/FieldLayout'
import { PopUpContext } from '../../layout/popup/PopUpContext'

export interface SelectIds {
  trigger: string,
  content: string,
  listbox: string,
  searchInput: string,
}

export interface SelectRootProps<T> extends Omit<Partial<FormFieldDataHandling<T>>, 'value'>, Partial<FormFieldInteractionStates> {
  value?: T | null,
  initialValue?: T | null,
  compareFunction?: (a: T | null, b: T | null) => boolean,
  initialIsOpen?: boolean,
  onClose?: () => void,
  onIsOpenChange?: (isOpen: boolean) => void,
  searchableThreshold?: number,
  iconAppearance?: 'left' | 'right' | 'none',
  children: ReactNode,
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
  iconAppearance = 'right',
  invalid = false,
  disabled = false,
  readOnly = false,
  required = false,
}: SelectRootProps<T>) {
  const nullTrigger = useRef<HTMLElement | null>(null)
  const [triggerRef, setTriggerRef] = useState<RefObject<HTMLElement | null>>(nullTrigger)
  const [options, setOptions] = useState<SelectOptionType<T>[]>([])
  const [optionSnapshots, setOptionSnapshots] = useState<Record<string, SelectOptionType<T>>>({})
  const generatedId = useId()
  const [ids, setIds] = useState<SelectIds>({
    trigger: 'select-' + generatedId,
    content: 'select-content-' + generatedId,
    listbox: 'select-listbox-' + generatedId,
    searchInput: 'select-search-' + generatedId,
  })


  const registerOption = useCallback(
    (item: SelectOptionType<T>) => {
      setOptionSnapshots((previous) => ({ ...previous, [item.value.id]: item }))
      setOptions((prev) => {
        const next = prev.filter((o) => o.value.id !== item.value.id)
        next.push(item)
        next.sort((a, b) =>
          DOMUtils.compareDocumentPosition(a.ref.current, b.ref.current))
        return next
      })
      return () =>
        setOptions((prev) => prev.filter((o) => o.value.id !== item.value.id))
    },
    []
  )

  const registerTrigger = useCallback((ref: RefObject<HTMLElement | null>) => {
    setTriggerRef(ref)
    return () => {
      setTriggerRef(nullTrigger)
    }
  }, [])

  const compare = useMemo(() => compareFunction ?? Object.is, [compareFunction])

  const idToOptionMap = useMemo(() => {
    return options.reduce((acc, o) => {
      acc[o.value.id] = o
      return acc
    }, {} as Record<string, SelectOptionType<T>>)
  }, [options])

  const mappedValueId = useMemo(() => {
    if(value === undefined) return undefined
    return options.find((o) => compare(o.value.value, value))?.value.id ?? null
  }, [options, value, compare])

  const mappedInitialValueId = useMemo(() => {
    if(initialValue === undefined) return undefined
    return options.find((o) => compare(o.value.value, initialValue))?.value.id ?? null
  }, [options, initialValue, compare])

  const onValueChangeStable = useEventCallbackStabilizer(onValueChange)
  const onEditCompleteStable = useEventCallbackStabilizer(onEditComplete)
  const onIsOpenChangeStable = useEventCallbackStabilizer(onIsOpenChange)

  const onValueChangeWrapper = useCallback((value: string) => {
    const option = idToOptionMap[value]
    if(option === undefined) {
      console.warn(`Attempted to select an option ${value} that is not valid`)
      return
    }
    onValueChangeStable(option.value.value)
  }, [onValueChangeStable, idToOptionMap])

  const onEditCompleteWrapper = useCallback((value: string) => {
    const option = idToOptionMap[value]
    if(option === undefined) {
      console.warn(`Attempted to edit complete an option ${value} that is not valid`)
      return
    }
    onEditCompleteStable(option.value.value)
  }, [onEditCompleteStable, idToOptionMap])


  const state = useSelect({
    value: mappedValueId,
    initialValue: mappedInitialValueId,
    onValueChange: onValueChangeWrapper,
    onEditComplete: onEditCompleteWrapper,
    options: options.map((o) => ({
      id: o.value.id,
      label: o.label,
      disabled: o.disabled,
    })),
    initialIsOpen,
    onClose,
    onIsOpenChange: onIsOpenChangeStable,
  })
  const { setSearchQuery } = state
  const knownOptionCount = Math.max(options.length, Object.keys(optionSnapshots).length)
  const hasSearch = knownOptionCount >= searchableThreshold

  useEffect(() => {
    if (!hasSearch) {
      setSearchQuery('')
    }
  }, [hasSearch, setSearchQuery])

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
    if(typeof updater === 'function') {
      state.setIsOpen(updater(state.isOpen))
    } else {
      state.setIsOpen(updater)
    }
  }, [state])

  return (
    <SelectContext.Provider
      value={{
        invalid,
        disabled,
        readOnly,
        required,
        selectedId: state.value,
        highlightedId: state.highlightedValue ?? null,
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
