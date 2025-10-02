import type { ButtonHTMLAttributes, HTMLAttributes, PropsWithChildren, ReactNode } from 'react'
import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import clsx from 'clsx'
import type { Translation } from '@/src/localization/useTranslation'
import { useTranslation } from '@/src/localization/useTranslation'
import { ExpansionIcon } from '@/src/components/layout/Expandable'
import { useFocusTrap } from '@/src/hooks/focus/useFocusTrap'
import { match } from '@/src/utils/match'
import { CheckIcon, Plus, XIcon } from 'lucide-react'
import { Chip } from '@/src/components/layout/Chip'
import { IconButton, TextButton } from '@/src/components/user-action/Button'
import type { UseFloatingElementOptions } from '@/src/hooks/useFloatingElement'
import { useFloatingElement } from '@/src/hooks/useFloatingElement'
import { createPortal } from 'react-dom'

//
// Context
//
type RegisteredOption = {
  value: string,
  disabled: boolean,
  ref: React.RefObject<HTMLLIElement>,
}

type HighlightPosition = 'first' | 'last'
type SelectIconAppearance = 'left' | 'right' | 'none'

type InternalSelectContextState = {
  isOpen: boolean,
  highlightedValue?: string,
}

type SelectContextState = InternalSelectContextState & {
  id: string,
  value: string[],
  disabled: boolean,
  invalid: boolean,
}

type SelectConfiguration = {
  isMultiSelect: boolean,
  iconAppearance: SelectIconAppearance,
}

type ToggleOpenOptions = {
  highlightStartPosition?: HighlightPosition,
}

const defaultToggleOpenOptions: ToggleOpenOptions = {
  highlightStartPosition: 'first',
}

type SelectContextType = {
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

const SelectContext = createContext<SelectContextType | null>(null)

function useSelectContext() {
  const ctx = useContext(SelectContext)
  if (!ctx) {
    throw new Error('SelectContext must be used within a ListBoxPrimitive')
  }
  return ctx
}


//
// SelectRoot
//
export type SelectRootProps = PropsWithChildren<{
  id?: string,
  value?: string,
  onValueChanged?: (value: string) => void,
  values?: string[],
  onValuesChanged?: (value: string[]) => void,
  isOpen?: boolean,
  disabled?: boolean,
  invalid?: boolean,
  isMultiSelect?: boolean,
  iconAppearance?: SelectIconAppearance,
}>

export const SelectRoot = ({
                             children,
                             id,
                             value,
                             onValueChanged,
                             values,
                             onValuesChanged,
                             isOpen = false,
                             disabled = false,
                             invalid = false,
                             isMultiSelect = false,
                             iconAppearance = 'left',
                           }: SelectRootProps) => {
  const optionsRef = useRef<RegisteredOption[]>([])
  const triggerRef = useRef<HTMLElement>(null)
  const generatedId = useId()
  const usedId = id ?? generatedId

  const [internalState, setInternalState] = useState<InternalSelectContextState>({
    isOpen,
  })

  const state: SelectContextState = {
    ...internalState,
    id: usedId,
    disabled,
    invalid,
    value: isMultiSelect ? (values ?? []) : [value].filter(Boolean),
  }
  const config: SelectConfiguration = {
    isMultiSelect,
    iconAppearance,
  }

  const registerItem = useCallback((item: RegisteredOption) => {
    optionsRef.current.push(item)
    optionsRef.current.sort((a, b) => {
      const aEl = a.ref.current
      const bEl = b.ref.current
      if (!aEl || !bEl) return 0
      return aEl.compareDocumentPosition(bEl) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
    })
  }, [])

  const unregisterItem = useCallback((value: string) => {
    optionsRef.current = optionsRef.current.filter(i => i.value !== value)
  }, [])

  // Setting isSelected to false only works for multiselects
  const toggleSelection = (value: string, isSelected?: boolean) => {
    if (disabled) {
      return
    }
    const option = optionsRef.current.find(i => i.value === value)
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
      onValueChanged?.(newValue[0])
    } else {
      onValuesChanged?.(newValue)
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

  const toggleOpen = (isOpen?: boolean, options?: ToggleOpenOptions) => {
    const { highlightStartPosition } = { ...defaultToggleOpenOptions, ...options }
    let highlightedIndex: number
    if (highlightStartPosition === 'first') {
      highlightedIndex = optionsRef.current.findIndex(option => !option.disabled)
    } else {
      highlightedIndex = optionsRef.current.length - 1 - [...optionsRef.current].reverse().findIndex(option => !option.disabled)
    }
    if (highlightedIndex === -1 || highlightedIndex === optionsRef.current.length) {
      highlightedIndex = 0
    }
    setInternalState(prevState => ({
      ...prevState,
      isOpen: isOpen ?? !prevState.isOpen,
      highlightedValue: optionsRef.current[highlightedIndex].value,
    }))
  }

  const moveHighlightedIndex = (delta: number) => {
    let highlightedIndex = optionsRef.current.findIndex(value => value.value === internalState.highlightedValue)
    if (highlightedIndex === -1) {
      highlightedIndex = 0
    }
    const optionLength = optionsRef.current.length
    const startIndex = (highlightedIndex + (delta % optionLength) + optionLength) % optionLength
    const isForward = delta >= 0
    let highlightedValue = optionsRef.current[startIndex].value
    for (let i = 0; i < optionsRef.current.length; i++) {
      const index = (startIndex + (isForward ? i : -i) + optionLength) % optionLength
      if (!optionsRef.current[index].disabled) {
        highlightedValue = optionsRef.current[index].value
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
    const highlighted = optionsRef.current.find(value => value.value === internalState.highlightedValue)
    if (highlighted) {
      highlighted.ref.current.scrollIntoView({ behavior: 'instant', block: 'nearest' })
    } else {
      console.error(`SelectRoot: Could not find highlighted value (${internalState.highlightedValue})`)
    }
  }, [internalState.highlightedValue])

  const contextValue: SelectContextType = {
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
// SelectOption
//
export type SelectOptionProps = Omit<HTMLAttributes<HTMLLIElement>, 'children'> & {
  value: string,
  disabled?: boolean,
  iconAppearance?: SelectIconAppearance,
  children?: ReactNode,
}

export const SelectOption = forwardRef<HTMLLIElement, SelectOptionProps>(
  function SelectOption({ children, value, disabled = false, iconAppearance, className, ...restProps }, ref) {
    const { state, config, item, trigger } = useSelectContext()
    const { register, unregister, toggleSelection, highlightItem } = item
    const itemRef = useRef<HTMLLIElement>(null)

    iconAppearance ??= config.iconAppearance

    // Register with parent
    useEffect(() => {
      register({
        value,
        disabled,
        ref: itemRef,
      })
      return () => unregister(value)
    }, [value, disabled, register, unregister, children])

    const isHighlighted = state.highlightedValue === value
    const isSelected = state.value.includes(value)

    return (
      <li
        {...restProps}
        ref={(node) => {
          itemRef.current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLLIElement | null>).current = node
        }}
        id={value}
        role="option"
        aria-disabled={disabled}
        aria-selected={isSelected}
        data-highlighted={isHighlighted ? '' : undefined}
        data-selected={isSelected ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        className={clsx(
          'flex-row-1 items-center px-2 py-1 rounded-md',
          'data-highlighted:bg-primary/20',
          'data-disabled:text-disabled data-disabled:cursor-not-allowed',
          'not-data-disabled:cursor-pointer',
          className
        )}
        onClick={(event) => {
          if (!disabled) {
            toggleSelection(value)
            if (!config.isMultiSelect) {
              trigger.toggleOpen(false)
            }
            restProps.onClick?.(event)
          }
        }}
        onMouseEnter={(event) => {
          if (!disabled) {
            highlightItem(value)
            restProps.onMouseEnter?.(event)
          }
        }}
      >
        {iconAppearance === 'left' && (
          <CheckIcon
            className={clsx('w-4 h-4', { 'opacity-0': !isSelected || disabled })}
            aria-hidden={true}
          />
        )}
        {children ?? value}
        {iconAppearance === 'right' && (
          <CheckIcon
            className={clsx('w-4 h-4', { 'opacity-0': !isSelected || disabled })}
            aria-hidden={true}
          />
        )}
      </li>
    )
  }
)

///
/// SelectButton
///
type SelectButtonTranslationType = {
  clickToSelect: string,
}

const defaultSelectButtonTranslation: Translation<SelectButtonTranslationType> = {
  en: {
    clickToSelect: 'Click to select',

  },
  de: {
    clickToSelect: 'Zum auswählen drücken'
  }
}

type SelectButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  placeholder?: ReactNode,
  selectedDisplay?: (value: string[]) => ReactNode,
}

export const SelectButton = forwardRef<HTMLButtonElement, SelectButtonProps>(function SelectButton(
  { placeholder, selectedDisplay, ...props }, ref
) {
  const translation = useTranslation([defaultSelectButtonTranslation])
  const { state, trigger } = useSelectContext()
  const { register, unregister, toggleOpen } = trigger

  const innerRef = useRef<HTMLButtonElement>(null)
  useImperativeHandle(ref, () => innerRef.current)

  useEffect(() => {
    register(innerRef)
    return () => unregister()
  }, [register, unregister])

  const disabled = !!props?.disabled || !!state.disabled
  const invalid = state.invalid
  const hasValue = state.value.length > 0

  return (
    <button
      {...props}
      ref={innerRef}
      id={state.id} // TODO allow for a custom id here
      disabled={disabled}

      onClick={(event) => {
        props.onClick?.(event)
        toggleOpen(!state.isOpen)
      }}
      onKeyDown={event => {
        props.onKeyDown?.(event)
        switch (event.key) {
          case 'ArrowDown':
            toggleOpen(true, { highlightStartPosition: 'first' })
            event.preventDefault()
            event.stopPropagation()
            break
          case 'ArrowUp':
            toggleOpen(true, { highlightStartPosition: 'last' })
            event.preventDefault()
            event.stopPropagation()
            break
        }
      }}

      className={clsx(
        'flex-row-2 items-center justify-between rounded-md px-3 py-2',
        {
          'bg-input-background text-placeholder': !hasValue && !disabled && !invalid,
          'bg-input-background text-input-text': hasValue && !disabled && !invalid,
          'bg-negative/20 text-negative': !disabled && invalid,
          'bg-disabled-background text-disabled': disabled,
        },
        props.className
      )}

      data-placeholder={!hasValue ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-invalid={invalid ? '' : undefined}

      aria-invalid={invalid}
      aria-disabled={disabled}
      aria-haspopup="listbox"
      aria-expanded={state.isOpen}
      aria-controls={state.isOpen ? `${state.id}-listbox` : undefined}
    >
      {hasValue ?
        selectedDisplay?.(state.value) ?? state.value.join(', ')
        : placeholder ?? translation('clickToSelect')
      }
      <ExpansionIcon
        isExpanded={state.isOpen}
        className={clsx({
          'text-input-text': !disabled && !invalid,
          'text-negative': !disabled && invalid,
          'text-disabled': disabled,
        })}
      />
    </button>
  )
})

///
/// SelectChipDisplay
///
type SelectChipDisplayProps = HTMLAttributes<HTMLDivElement> & {
  disabled?: boolean,
  placeholder?: ReactNode,
}

export const SelectChipDisplay = forwardRef<HTMLDivElement, SelectChipDisplayProps>(function SelectChipDisplay(
  { ...props }, ref
) {
  const { state, trigger, item } = useSelectContext()
  const { register, unregister, toggleOpen } = trigger

  const innerRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(ref, () => innerRef.current)

  useEffect(() => {
    register(innerRef)
    return () => unregister()
  }, [register, unregister])

  const disabled = !!props?.disabled || !!state.disabled
  const invalid = state.invalid

  return (
    <div
      {...props}
      ref={innerRef}
      className={clsx(
        'flex flex-wrap flex-row gap-2 items-center bg-input-background text-input-text rounded-md px-2.5 py-2.5',
        props.className
      )}
      data-disabled={disabled ? '' : undefined}
      data-invalid={invalid ? '' : undefined}

      aria-invalid={invalid}
      aria-disabled={disabled}
    >
      {state.value.map((value) => (
        <Chip key={value} className="gap-x-2">
          {value}
          <TextButton
            // TODO add label to indicate purpose to screen reader
            onClick={() => {
              item.toggleSelection(value, false)
            }}
            size="none"
            color="negative"
            className="flex-row-0 items-center px-0.5 py-0.5 w-6 h-6 rounded"
          >
            <XIcon className="w-5 h-5"/>
          </TextButton>
        </Chip>
      ))}
      <IconButton
        id={state.id} // TODO allow for a custom id here
        onClick={() => toggleOpen()}
        onKeyDown={event => {
          switch (event.key) {
            case 'ArrowDown':
              toggleOpen(true, { highlightStartPosition: 'first' })
              break
            case 'ArrowUp':
              toggleOpen(true, { highlightStartPosition: 'last' })
          }
        }}
        size="small"
        color="neutral"

        aria-invalid={invalid}
        aria-disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={state.isOpen}
        aria-controls={state.isOpen ? `${state.id}-listbox` : undefined}
      >
        <Plus/>
      </IconButton>
    </div>
  )
})


///
/// SelectContent
///
type Orientation = 'vertical' | 'horizontal'

export type SelectContentProps = HTMLAttributes<HTMLUListElement> & {
  alignment?: Pick<UseFloatingElementOptions, 'gap' | 'horizontalAlignment' | 'verticalAlignment'>,
  orientation?: Orientation,
}

export const SelectContent = forwardRef<HTMLUListElement, SelectContentProps>(
  function SelectContent({
                           alignment,
                           orientation = 'vertical',
                           ...props
                         }, ref) {
    const innerRef = useRef<HTMLUListElement | null>(null)
    useImperativeHandle(ref, () => innerRef.current)

    const { trigger, state, config, item } = useSelectContext()

    const position = useFloatingElement({
      active: state.isOpen,
      anchorRef: trigger.ref,
      containerRef: innerRef,
      ...alignment,
    })

    useFocusTrap({
      container: innerRef,
      active: state.isOpen && !!position,
    })

    return createPortal(
      <>
        <div
          hidden={!state.isOpen}
          onClick={() => trigger.toggleOpen(false)}
          className={clsx('fixed w-screen h-screen inset-0')}
        />
        <ul
          {...props}
          id={`${state.id}-listbox`}
          ref={innerRef}
          hidden={!state.isOpen}
          onKeyDown={(event) => {
            switch (event.key) {
              case 'Escape':
                trigger.toggleOpen(false)
                event.preventDefault()
                event.stopPropagation()
                break
              case match(orientation, {
                vertical: 'ArrowDown',
                horizontal: 'ArrowUp'
              }):
                item.moveHighlightedIndex(1)
                event.preventDefault()
                break
              case match(orientation, {
                vertical: 'ArrowUp',
                horizontal: 'ArrowDown'
              }):
                item.moveHighlightedIndex(-1)
                event.preventDefault()
                break
              case 'Home':
                // TODO support later by selecting the first not disabled entry
                event.preventDefault()
                break
              case 'End':
                // TODO support later by selecting the last not disabled entry
                event.preventDefault()
                break
              case 'Enter': // Fall through
              case ' ':
                if (state.highlightedValue) {
                  item.toggleSelection(state.highlightedValue)
                  if (!config.isMultiSelect) {
                    trigger.toggleOpen(false)
                  }
                  event.preventDefault()
                }
                break
            }
          }}

          className={clsx('flex-col-0 p-2 bg-menu-background text-menu-text rounded-md shadow-hw-bottom focus-style-within overflow-auto', props.className)}
          style={{
            opacity: position ? undefined : 0,
            position: 'fixed',
            ...position
          }}

          role="listbox"
          aria-multiselectable={config.isMultiSelect}
          aria-orientation={orientation}
          tabIndex={position ? 0 : undefined}
        >
          {props.children}
        </ul>
      </>, document.body
    )
  }
)

//
// Select
//
export type SelectProps = Omit<SelectRootProps, 'isMultiSelect' | 'values' | 'onValuesChanged'> & {
  contentPanelProps?: SelectContentProps,
  buttonProps?: Omit<SelectButtonProps, 'selectedDisplay'> & { selectedDisplay?: (value: string) => ReactNode },
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select({
                                                                                   children,
                                                                                   contentPanelProps,
                                                                                   buttonProps,
                                                                                   ...props
                                                                                 }, ref) {
  return (
    <SelectRoot {...props} isMultiSelect={false}>
      <SelectButton
        ref={ref}
        {...buttonProps}
        selectedDisplay={values => {
          const value = values[0]
          if (!buttonProps?.selectedDisplay) return undefined
          return buttonProps.selectedDisplay(value)
        }}
      />
      <SelectContent {...contentPanelProps}>{children}</SelectContent>
    </SelectRoot>
  )
})


export type SelectUncontrolledProps = SelectProps
export const SelectUncontrolled = forwardRef<HTMLButtonElement, SelectUncontrolledProps>(function SelectUncontrolled({
                                                                                                                       value: initialValue,
                                                                                                                       onValueChanged,
                                                                                                                       ...props
                                                                                                                     }, ref) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <Select
      {...props}
      ref={ref}
      value={value}
      onValueChanged={value => {
        setValue(value)
        onValueChanged?.(value)
      }}
    />
  )
})


//
// MultiSelect
//
export type MultiSelectProps = Omit<SelectRootProps, 'isMultiSelect' | 'value' | 'onValueChanged'> & {
  contentPanelProps?: SelectContentProps,
  buttonProps?: SelectButtonProps,
}

export const MultiSelect = forwardRef<HTMLButtonElement, MultiSelectProps>(function MultiSelect({
                                                                                                  children,
                                                                                                  contentPanelProps,
                                                                                                  buttonProps,
                                                                                                  ...props
                                                                                                }, ref) {
  return (
    <SelectRoot {...props} isMultiSelect={true}>
      <SelectButton ref={ref} {...buttonProps} />
      <SelectContent {...contentPanelProps}>{children}</SelectContent>
    </SelectRoot>
  )
})


export type MultiSelectUncontrolledProps = MultiSelectProps
export const MultiSelectUncontrolled = forwardRef<HTMLButtonElement, MultiSelectUncontrolledProps>(function MultiSelectUncontrolled({
                                                                                                                                      values: initialValues,
                                                                                                                                      onValuesChanged,
                                                                                                                                      ...props
                                                                                                                                    }, ref) {
  const [values, setValues] = useState(initialValues)

  useEffect(() => {
    setValues(initialValues)
  }, [initialValues])

  return (
    <MultiSelect
      {...props}
      ref={ref}
      values={values}
      onValuesChanged={value => {
        setValues(value)
        onValuesChanged?.(value)
      }}
    />
  )
})


//
// MultiSelectChipDisplay
//
export type MultiSelectChipDisplayProps = Omit<SelectRootProps, 'isMultiSelect' | 'value' | 'onValueChanged'> & {
  contentPanelProps?: SelectContentProps,
  chipDisplayProps?: SelectChipDisplayProps,
}

export const MultiSelectChipDisplay = forwardRef<HTMLDivElement, MultiSelectChipDisplayProps>(function MultiSelectChipDisplay({
                                                                                                                                children,
                                                                                                                                contentPanelProps,
                                                                                                                                chipDisplayProps,
                                                                                                                                ...props
                                                                                                                              }, ref) {
  return (
    <SelectRoot {...props} isMultiSelect={true}>
      <SelectChipDisplay ref={ref} {...chipDisplayProps} />
      <SelectContent {...contentPanelProps}>{children}</SelectContent>
    </SelectRoot>
  )
})


export type MultiSelectChipDisplayUncontrolledProps = MultiSelectChipDisplayProps
export const MultiSelectChipDisplayUncontrolled = forwardRef<HTMLDivElement, MultiSelectChipDisplayUncontrolledProps>(function MultiSelectChipDisplayUncontrolled({
                                                                                                                                                                    values: initialValues,
                                                                                                                                                                    onValuesChanged,
                                                                                                                                                                    ...props
                                                                                                                                                                  }, ref) {
  const [values, setValues] = useState(initialValues)

  useEffect(() => {
    setValues(initialValues)
  }, [initialValues])

  return (
    <MultiSelectChipDisplay
      {...props}
      ref={ref}
      values={values}
      onValuesChanged={value => {
        setValues(value)
        onValuesChanged?.(value)
      }}
    />
  )
})