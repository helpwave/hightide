import type { ButtonHTMLAttributes, HTMLAttributes, PropsWithChildren, ReactNode, RefObject } from 'react'
import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import clsx from 'clsx'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { ExpansionIcon } from '@/src/components/display-and-visualization/ExpansionIcon'
import { useFocusTrap } from '@/src/hooks/focus/useFocusTrap'
import { match } from '@/src/utils/match'
import { CheckIcon, Plus, XIcon } from 'lucide-react'
import { Chip } from '@/src/components/display-and-visualization/Chip'
import { Button } from '@/src/components/user-interaction/Button'
import type { UseFloatingElementOptions } from '@/src/hooks/useFloatingElement'
import { useFloatingElement } from '@/src/hooks/useFloatingElement'
import { createPortal } from 'react-dom'
import { useOverwritableState } from '@/src/hooks/useOverwritableState'
import { useOverlayRegistry } from '@/src/hooks/useOverlayRegistry'

//
// Context
//
type RegisteredOption = {
  value: string,
  label: ReactNode,
  disabled: boolean,
  ref: React.RefObject<HTMLLIElement>,
}

type HighlightStartPositionBehavior = 'first' | 'last'
type SelectIconAppearance = 'left' | 'right' | 'none'

type InternalSelectContextState = {
  isOpen: boolean,
  options: RegisteredOption[],
  highlightedValue?: string,
}

type SelectContextState = InternalSelectContextState & {
  id: string,
  value: string[],
  disabled: boolean,
  invalid: boolean,
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
export type SelectRootProps = PropsWithChildren & {
  id?: string,
  value?: string,
  onValueChange?: (value: string) => void,
  values?: string[],
  onValuesChange?: (value: string[]) => void,
  isOpen?: boolean,
  disabled?: boolean,
  invalid?: boolean,
  isMultiSelect?: boolean,
  iconAppearance?: SelectIconAppearance,
}

export const SelectRoot = ({
  children,
  id,
  value,
  onValueChange,
  values,
  onValuesChange,
  isOpen = false,
  disabled = false,
  invalid = false,
  isMultiSelect = false,
  iconAppearance = 'left',
}: SelectRootProps) => {
  const triggerRef = useRef<HTMLElement>(null)
  const generatedId = useId()
  const usedId = id ?? generatedId

  const [internalState, setInternalState] = useState<InternalSelectContextState>({
    isOpen,
    options: [],
  })

  const selectedValues = useMemo(() => isMultiSelect ? (values ?? []) : [value].filter(Boolean),
    [isMultiSelect, value, values])
  const selectedOptions = useMemo(() =>
    selectedValues.map(value => internalState.options.find(option => value === option.value)).filter(Boolean),
  [selectedValues, internalState.options])
  const state: SelectContextState = {
    ...internalState,
    id: usedId,
    disabled,
    invalid,
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
      onValueChange?.(newValue[0])
    } else {
      onValuesChange?.(newValue)
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
    setInternalState(prevState => ({
      ...prevState,
      isOpen: isOpen ?? !prevState.isOpen,
      highlightedValue: firstSelectedValue ?? firstEnabledValue
    }))
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const label = children ?? value

    // Register with parent
    useEffect(() => {
      register({
        value,
        label,
        disabled,
        ref: itemRef,
      })
      return () => unregister(value)
    }, [value, disabled, register, unregister, children, label])

    const isHighlighted = state.highlightedValue === value
    const isSelected = state.value.includes(value)

    return (
      <li
        {...restProps}
        ref={(node) => {
          itemRef.current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as RefObject<HTMLLIElement | null>).current = node
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
        {iconAppearance === 'left' && (state.value.length > 0 || config.isMultiSelect) && (
          <CheckIcon
            className={clsx('w-4 h-4', { 'opacity-0': !isSelected || disabled })}
            aria-hidden={true}
          />
        )}
        {label}
        {iconAppearance === 'right' && (state.value.length > 0 || config.isMultiSelect) && (
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
type SelectButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  placeholder?: ReactNode,
  selectedDisplay?: (value: string[]) => ReactNode,
}

export const SelectButton = forwardRef<HTMLButtonElement, SelectButtonProps>(function SelectButton(
  { placeholder, selectedDisplay, ...props }, ref
) {
  const translation = useHightideTranslation()
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
      type="button"

      onClick={(event) => {
        props.onClick?.(event)
        toggleOpen(!state.isOpen)
      }}
      onKeyDown={event => {
        props.onKeyDown?.(event)
        switch (event.key) {
        case 'ArrowDown':
          toggleOpen(true, { highlightStartPositionBehavior: 'first' })
          event.preventDefault()
          event.stopPropagation()
          break
        case 'ArrowUp':
          toggleOpen(true, { highlightStartPositionBehavior: 'last' })
          event.preventDefault()
          event.stopPropagation()
          break
        }
      }}

      data-name={props['data-name'] ?? 'select-button'}
      data-value={hasValue ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-invalid={invalid ? '' : undefined}

      aria-invalid={invalid}
      aria-disabled={disabled}
      aria-haspopup="listbox"
      aria-expanded={state.isOpen}
      aria-controls={state.isOpen ? `${state.id}-listbox` : undefined}
    >
      {hasValue ?
        selectedDisplay?.(state.value) ?? (
          <div className={clsx('flex flex-wrap gap-x-1 gap-y-2')}>
            {state.selectedOptions.map(({ value, label }, index) => (
              <span key={value} className="flex-row-0">
                {label}
                {index < state.value.length - 1 && (<span>{','}</span>)}
              </span>
            ))}
          </div>
        )
        : placeholder ?? translation('clickToSelect')
      }
      <ExpansionIcon isExpanded={state.isOpen}/>
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

      onClick={(event) => {
        toggleOpen()
        props.onClick?.(event)
      }}

      data-name={props['data-name'] ?? 'select-button-chips'}
      data-value={state.value.length > 0 ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-invalid={invalid ? '' : undefined}

      aria-invalid={invalid}
      aria-disabled={disabled}
    >
      {state.selectedOptions.map(({ value, label }) => (
        <Chip key={value} className="gap-x-2">
          {label}
          <Button
            // TODO add label to indicate purpose to screen reader
            onClick={() => {
              item.toggleSelection(value, false)
            }}
            size="xs"
            color="negative"
            coloringStyle="text"
            layout="icon"
            className="flex-row-0 items-center"
          >
            <XIcon className="size-5"/>
          </Button>
        </Chip>
      ))}
      <Button
        id={state.id} // TODO allow for a custom id here
        onClick={(event) => {
          event.stopPropagation()
          toggleOpen()
        }}
        onKeyDown={event => {
          switch (event.key) {
          case 'ArrowDown':
            toggleOpen(true, { highlightStartPositionBehavior: 'first' })
            break
          case 'ArrowUp':
            toggleOpen(true, { highlightStartPositionBehavior: 'last' })
          }
        }}
        layout="icon"
        size="sm"
        color="neutral"

        aria-invalid={invalid}
        aria-disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={state.isOpen}
        aria-controls={state.isOpen ? `${state.id}-listbox` : undefined}

        className="size-9"
      >
        <Plus/>
      </Button>
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
  containerClassName?: string,
}

export const SelectContent = forwardRef<HTMLUListElement, SelectContentProps>(
  function SelectContent({
    alignment,
    orientation = 'vertical',
    containerClassName,
    ...props
  }, ref) {
    const innerRef = useRef<HTMLUListElement>(null)
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


    const { zIndex } = useOverlayRegistry({ isActive: state.isOpen })

    return createPortal(
      <div
        id={`select-container-${state.id}`}
        className={clsx('fixed inset-0 w-screen h-screen', containerClassName)}
        style={{ zIndex: zIndex }}
        hidden={!state.isOpen}
      >
        <div
          id={`select-background-${state.id}`}
          onClick={() => trigger.toggleOpen(false)}
          className={clsx('fixed inset-0 w-screen h-screen')}
        />
        <ul
          {...props}
          id={`${state.id}-listbox`}
          ref={innerRef}
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

          className={clsx('flex-col-0 p-2 bg-menu-background text-menu-text rounded-md shadow-hw-bottom focus-outline-within overflow-auto', props.className)}
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
      </div>, document.body
    )
  }
)

//
// Select
//
export type SelectProps = Omit<SelectRootProps, 'isMultiSelect' | 'values' | 'onValuesChange'> & {
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
  onValueChange,
  ...props
}, ref) {
  const [value, setValue] = useOverwritableState(initialValue, onValueChange)

  return (
    <Select
      {...props}
      ref={ref}
      value={value}
      onValueChange={setValue}
    />
  )
})


//
// MultiSelect
//
export type MultiSelectProps = Omit<SelectRootProps, 'isMultiSelect' | 'value' | 'values' | 'onValueChange' | 'onValuesChange'> & {
  value?: string[],
  onValueChange?: (value: string[]) => void,
  contentPanelProps?: SelectContentProps,
  buttonProps?: SelectButtonProps,
}

export const MultiSelect = forwardRef<HTMLButtonElement, MultiSelectProps>(function MultiSelect({
  children,
  value,
  onValueChange,
  contentPanelProps,
  buttonProps,
  ...props
}, ref) {
  return (
    <SelectRoot {...props} values={value} onValuesChange={onValueChange} isMultiSelect={true}>
      <SelectButton ref={ref} {...buttonProps} />
      <SelectContent {...contentPanelProps}>{children}</SelectContent>
    </SelectRoot>
  )
})


export const MultiSelectUncontrolled = forwardRef<HTMLButtonElement, MultiSelectProps>(function MultiSelectUncontrolled({
  value: initialValue,
  onValueChange,
  ...props
}, ref) {
  const [value, setValue] = useOverwritableState(initialValue, onValueChange)

  return (
    <MultiSelect
      {...props}
      ref={ref}
      value={value}
      onValueChange={setValue}
    />
  )
})


//
// MultiSelectChipDisplay
//
export type MultiSelectChipDisplayProps = Omit<SelectRootProps, 'isMultiSelect' | 'value' | 'values' | 'onValueChange' | 'onValuesChange'> & {
  value?: string[],
  onValueChange?: (value: string[]) => void,
  contentPanelProps?: SelectContentProps,
  chipDisplayProps?: SelectChipDisplayProps,
}

export const MultiSelectChipDisplay = forwardRef<HTMLDivElement, MultiSelectChipDisplayProps>(function MultiSelectChipDisplay({
  children,
  value,
  onValueChange,
  contentPanelProps,
  chipDisplayProps,
  ...props
}, ref) {
  return (
    <SelectRoot {...props} values={value} onValuesChange={onValueChange} isMultiSelect={true}>
      <SelectChipDisplay ref={ref} {...chipDisplayProps} />
      <SelectContent {...contentPanelProps}>{children}</SelectContent>
    </SelectRoot>
  )
})


export type MultiSelectChipDisplayUncontrolledProps = MultiSelectChipDisplayProps
export const MultiSelectChipDisplayUncontrolled = forwardRef<HTMLDivElement, MultiSelectChipDisplayUncontrolledProps>(function MultiSelectChipDisplayUncontrolled({
  value: initialValue,
  onValueChange,
  ...props
}, ref) {
  const [value, setValue] = useOverwritableState(initialValue, onValueChange)

  return (
    <MultiSelectChipDisplay
      {...props}
      ref={ref}
      value={value}
      onValueChange={setValue}
    />
  )
})