import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { FormFieldInteractionStates } from '../../form/FieldLayout'
import type { FormFieldDataHandling } from '../../form/FormField'
import { useControlledState } from '@/src/hooks/useControlledState'
import { MultiSearchWithMapping } from '@/src/utils/simpleSearch'

//
// Context
//
type RegisteredOption = {
  value: string,
  label: string,
  display: ReactNode,
  disabled: boolean,
  ref: React.RefObject<HTMLElement>,
}

export type HighlightStartPositionBehavior = 'first' | 'last'
export type SelectIconAppearance = 'left' | 'right' | 'none'

type InternalSelectContextState = {
  isOpen: boolean,
  options: RegisteredOption[],
  highlightedValue?: string,
  searchQuery: string,
}

type SelectContextIds = {
  trigger: string,
  content: string,
  listbox: string,
  searchInput: string,
}

type SelectContextState = InternalSelectContextState & FormFieldInteractionStates & {
  value: string[],
  selectedOptions: RegisteredOption[],
  visibleOptions: RegisteredOption[],
}

type SelectConfiguration = {
  isMultiSelect: boolean,
  iconAppearance: SelectIconAppearance,
}

type ToggleOpenOptions = {
  highlightStartPositionBehavior?: HighlightStartPositionBehavior,
}

const defaultToggleOpenOptions: ToggleOpenOptions = {
  highlightStartPositionBehavior: 'first',
}

type SelectContextType = {
  ids: SelectContextIds,
  setIds: Dispatch<SetStateAction<SelectContextIds>>,
  state: SelectContextState,
  config: SelectConfiguration,
  item: {
    register: (item: RegisteredOption) => void,
    unregister: (value: string) => void,
    toggleSelection: (value: string, isSelected?: boolean) => void,
    highlightFirst: () => void,
    highlightLast: () => void,
    highlightItem: (value: string) => void,
    moveHighlightedIndex: (delta: number) => void,
  },
  trigger: {
    ref: React.RefObject<HTMLElement>,
    register: (element: React.RefObject<HTMLElement>) => void,
    unregister: () => void,
    toggleOpen: (isOpen?: boolean, options?: ToggleOpenOptions) => void,
  },
  search: {
    showSearch: boolean,
    searchQuery: string,
    setSearchQuery: (query: string) => void,
  },
}

export const SelectContext = createContext<SelectContextType | null>(null)

export function useSelectContext() {
  const ctx = useContext(SelectContext)
  if (!ctx) {
    throw new Error('useSelectContext must be used within a SelectRoot or MultiSelectRoot')
  }
  return ctx
}


//
// PrimitiveSelectRoot
//
export interface SharedSelectRootProps extends Partial<FormFieldInteractionStates> {
  children: ReactNode,
  id?: string,
  initialIsOpen?: boolean,
  iconAppearance?: SelectIconAppearance,
  showSearch?: boolean,
  onClose?: () => void,
}

interface PrimitiveSelectRootProps extends SharedSelectRootProps {
  initialValue?: string,
  value?: string,
  onValueChange?: (value: string) => void,
  initialValues?: string[],
  values?: string[],
  onValuesChange?: (value: string[]) => void,
  isMultiSelect?: boolean,
}

const PrimitveSelectRoot = ({
  children,
  id,
  initialValue,
  value: controlledValue,
  onValueChange,
  initialValues,
  values: controlledValues,
  onValuesChange,
  onClose,
  initialIsOpen = false,
  disabled = false,
  readOnly = false,
  required = false,
  invalid = false,
  isMultiSelect = false,
  showSearch = false,
  iconAppearance = 'left',
}: PrimitiveSelectRootProps) => {
  const [value, setValue] = useControlledState({
    value: controlledValue,
    onValueChange,
    defaultValue: initialValue,
  })
  const [values, setValues] = useControlledState({
    value: controlledValues,
    onValueChange: onValuesChange,
    defaultValue: initialValues ?? [],
  })

  const triggerRef = useRef<HTMLElement>(null)
  const generatedId = useId()
  const prefix = isMultiSelect ? 'multi-select-' : 'select-'
  const [ids, setIds] = useState<SelectContextIds>({
    trigger: id ?? (prefix + generatedId),
    content: prefix + 'content-' + generatedId,
    listbox: prefix + 'listbox-' + generatedId,
    searchInput: prefix + 'search-' + generatedId,
  })

  const [internalState, setInternalState] = useState<InternalSelectContextState>({
    isOpen: initialIsOpen,
    options: [],
    searchQuery: '',
  })

  const selectedValues = useMemo(() => isMultiSelect ? (values ?? []) : [value].filter(Boolean),
    [isMultiSelect, value, values])

  const selectedOptions = useMemo(() =>
    selectedValues.map(value => internalState.options.find(option => value === option.value)).filter(Boolean),
  [selectedValues, internalState.options])

  const visibleOptions = useMemo(() => {
    const q = internalState.searchQuery.trim().toLowerCase()
    if (!q) return internalState.options
    return MultiSearchWithMapping(internalState.searchQuery, internalState.options, o => [o.label])
  }, [internalState.options, internalState.searchQuery])

  const state: SelectContextState = {
    ...internalState,
    disabled,
    invalid,
    readOnly,
    required,
    value: selectedValues,
    selectedOptions,
    visibleOptions,
  }

  const config: SelectConfiguration = {
    isMultiSelect,
    iconAppearance,
  }

  const registerItem = useCallback((item: RegisteredOption) => {
    setInternalState(prev => {
      const updatedOptions = [...prev.options, item]
      updatedOptions.sort((a, b) => {
        const aEl = a.ref.current
        const bEl = b.ref.current
        if (!aEl || !bEl) return 0
        return aEl.compareDocumentPosition(bEl) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
      })
      return {
        ...prev,
        options: updatedOptions,
      }
    })
  }, [])

  const unregisterItem = useCallback((value: string) => {
    setInternalState(prev => {
      const updatedOptions = prev.options.filter(i => i.value !== value)
      return {
        ...prev,
        options: updatedOptions,
      }
    })
  }, [])

  // Setting isSelected to false only works for multiselects
  const toggleSelection = (value: string, isSelected?: boolean) => {
    if (disabled) {
      return
    }
    const option = state.options.find(i => i.value === value)
    if (!option) {
      console.error(`SelectOption with value: ${value} not found`)
      return
    }

    let newValue: string[]
    if (isMultiSelect) {
      const isSelectedBefore = state.value.includes(value)
      const isSelectedAfter = isSelected ?? !isSelectedBefore
      if (!isSelectedAfter) {
        newValue = state.value.filter(v => v !== value)
      } else {
        newValue = [...state.value, value]
      }
    } else {
      newValue = [value]
    }

    if (!isMultiSelect) {
      setValue(newValue[0])
    } else {
      setValues(newValue)
    }

    setInternalState(prevState => ({
      ...prevState,
      highlightedValue: value,
    }))
  }

  const highlightItem = useCallback((value: string) => {
    if (disabled || !state.visibleOptions.some(opt => opt.value === value && !opt.disabled)) {
      return
    }
    setInternalState(prevState => ({
      ...prevState,
      highlightedValue: value,
    }))
  }, [disabled, state.visibleOptions])

  const highlightFirst = useCallback(() => {
    const firstOption = state.visibleOptions.find(opt => !opt.disabled)
    if(!firstOption) return
    highlightItem(firstOption.value)
  }, [highlightItem, state.visibleOptions])

  const highlightLast = useCallback(() => {
    const lastOption = [...state.visibleOptions].reverse().find(opt => !opt.disabled)
    if(!lastOption) return
    highlightItem(lastOption.value)
  }, [highlightItem, state.visibleOptions])

  const registerTrigger = useCallback((ref: React.RefObject<HTMLElement>) => {
    triggerRef.current = ref.current
  }, [])

  const unregisterTrigger = useCallback(() => {
    triggerRef.current = null
  }, [])

  const setSearchQuery = useCallback((query: string) => {
    setInternalState(prev => ({ ...prev, searchQuery: query }))
  }, [])

  const toggleOpen = (isOpen?: boolean, toggleOpenOptions?: ToggleOpenOptions) => {
    const { highlightStartPositionBehavior } = { ...defaultToggleOpenOptions, ...toggleOpenOptions }
    const optionsToUse = visibleOptions
    let firstSelectedValue: string | undefined
    let firstEnabledValue: string | undefined
    for (let i = 0; i < optionsToUse.length; i++) {
      const currentOption = optionsToUse[highlightStartPositionBehavior === 'first' ? i : optionsToUse.length - i - 1]
      if (!currentOption.disabled) {
        if (!firstEnabledValue) {
          firstEnabledValue = currentOption.value
        }
        if (selectedValues.includes(currentOption.value)) {
          firstSelectedValue = currentOption.value
          break
        }
      }
    }
    const newIsOpen = isOpen ?? !internalState.isOpen
    setInternalState(prevState => ({
      ...prevState,
      isOpen: newIsOpen,
      highlightedValue: firstSelectedValue ?? firstEnabledValue,
      ...(newIsOpen ? {} : { searchQuery: '' }),
    }))
    if (!newIsOpen) {
      onClose?.()
    }
  }

  const moveHighlightedIndex = (delta: number) => {
    const optionsToUse = visibleOptions
    if (optionsToUse.length === 0) return
    let highlightedIndex = optionsToUse.findIndex(opt => opt.value === internalState.highlightedValue)
    if (highlightedIndex === -1) {
      highlightedIndex = 0
    }
    const optionLength = optionsToUse.length
    const startIndex = (highlightedIndex + (delta % optionLength) + optionLength) % optionLength
    const isForward = delta >= 0
    let highlightedValue = optionsToUse[startIndex]?.value
    for (let i = 0; i < optionsToUse.length; i++) {
      const index = (startIndex + (isForward ? i : -i) + optionLength) % optionLength
      if (!optionsToUse[index].disabled) {
        highlightedValue = optionsToUse[index].value
        break
      }
    }

    setInternalState(prevState => ({
      ...prevState,
      highlightedValue,
    }))
  }

  useEffect(() => {
    const highlighted = visibleOptions.find(opt => opt.value === internalState.highlightedValue)
    if (highlighted) {
      highlighted.ref.current?.scrollIntoView({ behavior: 'instant', block: 'nearest' })
    } else if (visibleOptions.length > 0) {
      setInternalState(prev => ({ ...prev, highlightedValue: visibleOptions[0].value }))
    } else {
      setInternalState(prev => ({ ...prev, highlightedValue: undefined }))
    }
  }, [internalState.highlightedValue, visibleOptions])

  const contextValue: SelectContextType = {
    ids,
    setIds,
    state,
    config,
    item: {
      register: registerItem,
      unregister: unregisterItem,
      toggleSelection,
      highlightFirst,
      highlightLast,
      highlightItem,
      moveHighlightedIndex,
    },
    trigger: {
      ref: triggerRef,
      register: registerTrigger,
      unregister: unregisterTrigger,
      toggleOpen,
    },
    search: {
      showSearch,
      searchQuery: internalState.searchQuery,
      setSearchQuery,
    },
  }

  return (
    <SelectContext.Provider value={contextValue}>
      {children}
    </SelectContext.Provider>
  )
}

//
// SelectRoot
//
export type SelectRootProps = SharedSelectRootProps & Partial<FormFieldDataHandling<string>> & {
  initialValue?: string,
}

export const SelectRoot = ({ value, onValueChange, onEditComplete, ...props }: SelectRootProps) => {
  return (
    <PrimitveSelectRoot
      {...props}
      isMultiSelect={false}
      value={value}
      onValueChange={(value) => {
        onValueChange?.(value)
        onEditComplete?.(value)
      }}
    />
  )
}

//
// MultiSelectRoot
//
export interface MultiSelectRootProps extends SharedSelectRootProps, Partial<FormFieldDataHandling<string[]>> {
  initialValue?: string[],
}

export const MultiSelectRoot = ( { value, onValueChange, initialValue, onEditComplete,...props }: MultiSelectRootProps) => {
  return (
    <PrimitveSelectRoot
      {...props}
      isMultiSelect={true}
      initialValues={initialValue}
      values={value}
      onValuesChange={(values) => {
        onValueChange?.(values)
      }}
      onClose={() => {
        onEditComplete?.(value)
        props.onClose?.()
      }}
    />
  )
}