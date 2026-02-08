import type { Dispatch, PropsWithChildren, ReactNode, SetStateAction } from 'react'
import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { FormFieldInteractionStates } from '../../form/FieldLayout'
import type { FormFieldDataHandling } from '../../form/FormField'
import { useControlledState } from '@/src/hooks/useControlledState'

//
// Context
//
type RegisteredOption = {
    value: string,
    label: ReactNode,
    disabled: boolean,
    ref: React.RefObject<HTMLLIElement>,
  }

export type HighlightStartPositionBehavior = 'first' | 'last'
export type SelectIconAppearance = 'left' | 'right' | 'none'

type InternalSelectContextState = {
    isOpen: boolean,
    options: RegisteredOption[],
    highlightedValue?: string,
}

type SelectContextIds = {
    trigger: string,
    content: string,
}

type SelectContextState = InternalSelectContextState & FormFieldInteractionStates & {
    value: string[],
    selectedOptions: RegisteredOption[],
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
      highlightItem: (value: string) => void,
      moveHighlightedIndex: (delta: number) => void,
    },
    trigger: {
      ref: React.RefObject<HTMLElement>,
      register: (element: React.RefObject<HTMLElement>) => void,
      unregister: () => void,
      toggleOpen: (isOpen?: boolean, options?: ToggleOpenOptions) => void,
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
export type SharedSelectRootProps = Partial<FormFieldInteractionStates> & PropsWithChildren & {
    id?: string,
    initialIsOpen?: boolean,
    iconAppearance?: SelectIconAppearance,
    onClose?: () => void,
  }

type PrimitiveSelectRootProps =  SharedSelectRootProps & {
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
  const [ids, setIds] = useState<SelectContextIds>({
    trigger: id ?? (isMultiSelect ? 'multi-select-' + generatedId : 'select-' + generatedId),
    content: isMultiSelect ? 'multi-select-content-' + generatedId : 'select-content-' + generatedId,
  })

  const [internalState, setInternalState] = useState<InternalSelectContextState>({
    isOpen: initialIsOpen,
    options: [],
  })

  const selectedValues = useMemo(() => isMultiSelect ? (values ?? []) : [value].filter(Boolean),
    [isMultiSelect, value, values])

  const selectedOptions = useMemo(() =>
    selectedValues.map(value => internalState.options.find(option => value === option.value)).filter(Boolean),
  [selectedValues, internalState.options])

  const state: SelectContextState = {
    ...internalState,
    disabled,
    invalid,
    readOnly,
    required,
    value: selectedValues,
    selectedOptions,
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

  const highlightItem = (value: string) => {
    if (disabled) {
      return
    }
    setInternalState(prevState => ({
      ...prevState,
      highlightedValue: value,
    }))
  }

  const registerTrigger = useCallback((ref: React.RefObject<HTMLElement>) => {
    triggerRef.current = ref.current
  }, [])

  const unregisterTrigger = useCallback(() => {
    triggerRef.current = null
  }, [])

  const toggleOpen = (isOpen?: boolean, toggleOpenOptions?: ToggleOpenOptions) => {
    const { highlightStartPositionBehavior } = { ...defaultToggleOpenOptions, ...toggleOpenOptions }
    let firstSelectedValue: string | undefined
    let firstEnabledValue: string | undefined
    for (let i = 0; i < state.options.length; i++) {
      const currentOption = state.options[highlightStartPositionBehavior === 'first' ? i : state.options.length - i - 1]
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
      highlightedValue: firstSelectedValue ?? firstEnabledValue
    }))
    if (!newIsOpen) {
      onClose?.()
    }
  }

  const moveHighlightedIndex = (delta: number) => {
    let highlightedIndex = state.options.findIndex(value => value.value === internalState.highlightedValue)
    if (highlightedIndex === -1) {
      highlightedIndex = 0
    }
    const optionLength = state.options.length
    const startIndex = (highlightedIndex + (delta % optionLength) + optionLength) % optionLength
    const isForward = delta >= 0
    let highlightedValue = state.options[startIndex].value
    for (let i = 0; i < state.options.length; i++) {
      const index = (startIndex + (isForward ? i : -i) + optionLength) % optionLength
      if (!state.options[index].disabled) {
        highlightedValue = state.options[index].value
        break
      }
    }

    setInternalState(prevState => ({
      ...prevState,
      highlightedValue,
    }))
  }

  useEffect(() => {
    if (!internalState.highlightedValue) return
    const highlighted = internalState.options.find(value => value.value === internalState.highlightedValue)
    if (highlighted) {
      highlighted.ref.current?.scrollIntoView({ behavior: 'instant', block: 'nearest' })
    } else {
      console.error(`SelectRoot: Could not find highlighted value (${internalState.highlightedValue})`)
    }
  }, [internalState.highlightedValue, internalState.options])

  const contextValue: SelectContextType = {
    ids,
    setIds,
    state,
    config,
    item: {
      register: registerItem,
      unregister: unregisterItem,
      toggleSelection,
      highlightItem,
      moveHighlightedIndex,
    },
    trigger: {
      ref: triggerRef,
      register: registerTrigger,
      unregister: unregisterTrigger,
      toggleOpen,
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
export type MultiSelectRootProps = SharedSelectRootProps & Partial<FormFieldDataHandling<string[]>> & {
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