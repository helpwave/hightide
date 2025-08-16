import type {
  HTMLAttributes,
  HtmlHTMLAttributes,
  ReactNode } from 'react'
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
import { formTranslation } from '@/src/localization/defaults/form'
import { useTranslation } from '@/src/localization/useTranslation'
import { useLogOnce } from '@/src/hooks/useLogOnce'
import { ExpansionIcon } from '@/src/components/layout-and-navigation/Expandable'
import type { FloatingContainerProps } from '@/src/components/layout-and-navigation/FloatingContainer'
import { FloatingContainer } from '@/src/components/layout-and-navigation/FloatingContainer'
import { useFocusTrap } from '@/src/hooks/focus/useFocusTrap'
import { match } from '@/src/utils/match'

//
// Context
//
type RegisteredOption = {
  type: 'option',
  id: string,
  value: string,
  disabled: boolean,
  ref: React.RefObject<HTMLLIElement>,
}

type RegisteredSelectedDisplay = {
  type: 'selectedDisplay',
  id: string,
}

type RegisteredSelectItem = RegisteredOption | RegisteredSelectedDisplay

type SelectContextType = {
  registerItem: (item: RegisteredSelectItem) => void,
  unregisterItem: (id: string) => void,

  isHighlighted: (id: string) => boolean,
  highlightedId?: string,
  setHighlightedId: (id: string) => void,

  onItemClick: (id: string) => void,
  isSelected: (value: string) => boolean,
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
// SelectOption
//
export type SelectOptionProps = Omit<HTMLAttributes<HTMLLIElement>, 'children'> & {
  value: string,
  disabled?: boolean,
  children?: ReactNode,
}

export const SelectOption = forwardRef<HTMLLIElement, SelectOptionProps>(
  function SelectOption({ value, disabled = false, children, className, ...rest }, ref) {
    const {
      registerItem,
      unregisterItem,
      isHighlighted,
      setHighlightedId,
      onItemClick,
      isSelected,
    } = useSelectContext()

    const itemRef = useRef<HTMLLIElement>(null)
    const id = React.useId()

    // Register with parent
    useEffect(() => {
      registerItem({ type: 'option', id, value, disabled, ref: itemRef })
      return () => unregisterItem(id)
    }, [id, value, disabled, registerItem, unregisterItem])

    const highlighted = isHighlighted(id)
    const selected = isSelected(value)

    return (
      <li
        ref={(node) => {
          itemRef.current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLLIElement | null>).current = node
        }}
        id={id}
        role="option"
        aria-disabled={disabled}
        aria-selected={selected}
        data-highlighted={highlighted ? '' : undefined}
        data-selected={selected ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        className={clsx(
          'flex-row-1 items-center px-2 py-1 rounded-md',
          'data-highlighted:bg-primary/20',
          'data-disabled:text-disabled data-disabled:cursor-not-allowed',
          'not-data-disabled:cursor-pointer',
          className
        )}
        onClick={() => {
          if (!disabled) onItemClick(id)
        }}
        onMouseEnter={() => {
          if (!disabled) {
            setHighlightedId(id)
          }
        }}
        {...rest}
      >
        {children ?? value}
      </li>
    )
  }
)

//
// Select
//
type OpenState = {
  open: boolean,
  startIndex?: number,
}

type Orientation = 'vertical' | 'horizontal'

export type SelectPrimitiveProps = HtmlHTMLAttributes<HTMLButtonElement> &
  Pick<FloatingContainerProps, 'gap' | 'horizontalAlignment' | 'verticalAlignment' | 'className'> & {
  value?: string[],
  onItemClicked?: (value: string) => void,
  onSelectionChanged?: (value: string[]) => void,
  disabled?: boolean,
  invalid?: boolean,
  isMultiple?: boolean,
  orientation?: Orientation,
  placeholder?: ReactNode,
  contentClassName?: string,
}

/**
 * A Select Component for selecting form a list of options
 *
 * The State is managed by the parent
 */
export const SelectPrimitive = forwardRef<HTMLButtonElement, SelectPrimitiveProps>(function SelectPrimitive({
                                                                                                              value,
                                                                                                              id: userId,
                                                                                                              onSelectionChanged,
                                                                                                              onItemClicked,
                                                                                                              disabled = false,
                                                                                                              invalid = false,
                                                                                                              isMultiple = true,
                                                                                                              orientation = 'vertical',
                                                                                                              placeholder,
                                                                                                              contentClassName,
                                                                                                              horizontalAlignment = 'center',
                                                                                                              verticalAlignment = 'afterEnd',
                                                                                                              gap,
                                                                                                              ...props
                                                                                                            }, forwardRef) {
  const translation = useTranslation([formTranslation])

  const [openState, setOpenState] = useState<OpenState>({ open: false })
  const [highlightedIndex, setHighlightedIndex] = useState<number | undefined>(undefined)

  const triggerRef = useRef<HTMLButtonElement>(null)
  useImperativeHandle(forwardRef, () => triggerRef.current)
  const listBoxRef = useRef<HTMLUListElement | null>(null)
  const optionsRef = useRef<RegisteredOption[]>([])
  const selectedRef = useRef<RegisteredSelectedDisplay>(null)

  const generatedId = useId()
  const id = generatedId ?? userId

  const registerItem = useCallback((item: RegisteredSelectItem) => {
    if (item.type === 'selectedDisplay') {
      selectedRef.current = item
    } else if (item.type === 'option') {
      optionsRef.current.push(item)
      optionsRef.current.sort((a, b) => {
        const aEl = a.ref.current
        const bEl = b.ref.current
        if (!aEl || !bEl) return 0
        return aEl.compareDocumentPosition(bEl) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
      })
    }
  }, [])

  const unregisterItem = useCallback((id: string) => {
    optionsRef.current = optionsRef.current.filter(i => i.id !== id)
  }, [])

  const isSelected = useCallback(
    (val: string) => (value ?? []).includes(val),
    [value]
  )

  const isHighlighted = useCallback(
    (val: string) => highlightedIndex !== undefined && optionsRef.current[highlightedIndex]?.id === val,
    [highlightedIndex]
  )


  const onItemClickedHandler = useCallback(
    (id: string) => {
      const index = optionsRef.current.findIndex(i => i.id === id)
      if (index === -1) {
        console.error('ListBoxItem provided an invalid id')
        return
      }
      const item = optionsRef.current[index]
      const val = item.value
      onItemClicked?.(val)
      setHighlightedIndex(index)
      if (!isMultiple) {
        onSelectionChanged?.([val])
        setOpenState({ open: false })
      } else {
        if (isSelected(val)) {
          onSelectionChanged?.((value ?? []).filter(v => v !== val))
        } else {
          onSelectionChanged?.([...(value ?? []), val])
        }
      }
    },
    [onItemClicked, isMultiple, onSelectionChanged, isSelected, value]
  )

  const setHighlightedId = useCallback((id: string) => {
    const index = optionsRef.current.findIndex(i => i.id === id)
    if (index !== -1) {
      setHighlightedIndex(index)
    }
  }, [])

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex !== undefined) {
      optionsRef.current[highlightedIndex]?.ref.current?.scrollIntoView({ block: 'nearest', behavior: 'auto' })
    }
  }, [highlightedIndex])

  const highlightedItem: RegisteredSelectItem | undefined = optionsRef.current[highlightedIndex]
  const ctxValue: SelectContextType = {
    registerItem,
    unregisterItem,
    isHighlighted,
    highlightedId: highlightedItem?.id,
    setHighlightedId,
    onItemClick: onItemClickedHandler,
    isSelected,
  }

  const moveHighlight = (delta: number) => {
    if (optionsRef.current.length === 0) return
    let nextIndex = highlightedIndex ?? -1
    for (let i = 0; i < optionsRef.current.length; i++) {
      nextIndex = (nextIndex + delta + optionsRef.current.length) % optionsRef.current.length
      if (!optionsRef.current[nextIndex].disabled) break
    }
    setHighlightedIndex(nextIndex)
  }

  const selectedOption = useMemo(() => optionsRef.current.find(option => (value ?? []).some(value => value === option.value)), [value])
  useLogOnce(
    'The selected value is not found in the options list.',
    value !== undefined && selectedOption !== undefined
  )

  useFocusTrap({
    container: listBoxRef,
    active: openState.open,
    focusFirst: true,
  })

  return (
    <>
      <button
        id={id}
        ref={triggerRef}
        {...props}
        className={clsx(
          'flex-row-4 items-center justify-between bg-input-background text-input-text rounded-md px-2.5 py-2.5',
          'data-placeholder:text-description',
          props.className
        )}
        onClick={() => setOpenState(({ open }) => ({ open: !open }))}
        onKeyDown={event => {
          switch (event.key) {
            case 'ArrowDown':
              setOpenState({ open: true, startIndex: 0 })
              break
            case 'ArrowUp':
              setOpenState({ open: true, startIndex: optionsRef.current.length - 1 })
          }
        }}

        data-placeholder={!value ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        data-invalid={invalid ? '' : undefined}

        aria-invalid={invalid}
        aria-disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={openState.open}
        aria-controls={openState.open ? `${id}-listbox` : undefined}
      >
        {(value ?? []).length > 0 ? (value ?? value.join(', ')) : placeholder ?? `${translation('select')}...`}
        <ExpansionIcon isExpanded={openState.open}/>
      </button>
      {openState.open && (
        <FloatingContainer
          id={`${id}-listbox`}
          verticalAlignment={verticalAlignment}
          horizontalAlignment={horizontalAlignment}
          gap={gap}
          anchor={triggerRef}
          className={clsx('flex-col-0 p-2 bg-menu-background text-menu-text rounded-md shadow-hw-bottom focus-style-within', contentClassName)}
        >
          <SelectContext.Provider value={ctxValue}>
            <ul
              ref={listBoxRef}
              onFocus={() => {
                if (highlightedIndex === undefined) {
                  const firstEnabled = optionsRef.current.findIndex(i => !i.disabled)
                  setHighlightedIndex(firstEnabled !== -1 ? firstEnabled : undefined)
                }
              }}
              onBlur={() => {
                setHighlightedIndex(undefined)
              }}
              onKeyDown={(event) => {
                switch (event.key) {
                  case 'Escape':
                    setOpenState({ open: false })
                    event.preventDefault()
                    break
                  case match(orientation, {
                    vertical: 'ArrowDown',
                    horizontal: 'ArrowUp'
                  }):
                    moveHighlight(1)
                    event.preventDefault()
                    break
                  case match(orientation, {
                    vertical: 'ArrowUp',
                    horizontal: 'ArrowDown'
                  }):
                    moveHighlight(-1)
                    event.preventDefault()
                    break
                  case 'Home':
                    setHighlightedIndex(optionsRef.current.findIndex(i => !i.disabled))
                    event.preventDefault()
                    break
                  case 'End':
                    for (let i = optionsRef.current.length - 1; i >= 0; i--) {
                      if (!optionsRef.current[i].disabled) {
                        setHighlightedIndex(i)
                        break
                      }
                    }
                    event.preventDefault()
                    break
                  case 'Enter':
                  case ' ':
                    if (highlightedIndex !== undefined) {
                      event.preventDefault()
                      onItemClickedHandler(optionsRef.current[highlightedIndex].id)
                    }
                    break
                }
              }}

              className={clsx('focus-style-none', props.className)}

              role="listbox"
              aria-multiselectable={isMultiple}
              aria-orientation={orientation}
              tabIndex={0}
            >
              {props.children}
            </ul>
          </SelectContext.Provider>
        </FloatingContainer>
      )}
    </>
  )
})

export type SelectProps = Omit<SelectPrimitiveProps, 'isMultiple' | 'value' | 'onSelectionChanged'> & {
  value?: string,
  onSelectionChanged?: (value?: string) => void,
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select({
                                                                                   value,
                                                                                   onSelectionChanged,
                                                                                   ...props
                                                                                 }, ref) {
  return (
    <SelectPrimitive
      {...props}
      ref={ref}
      value={value !== undefined ? [value] : undefined}
      onSelectionChanged={value => onSelectionChanged(value[0])}
      isMultiple={false}
    />
  )
})


export type SelectUncontrolledProps = SelectProps
export const SelectUncontrolled = forwardRef<HTMLButtonElement, SelectUncontrolledProps>(function SelectUncontrolled({
                                                                                                                       value: initialValue,
                                                                                                                       onSelectionChanged,
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
      onSelectionChanged={value => {
        setValue(value)
        onSelectionChanged?.(value)
      }}
    />
  )
})


//
// MultiSelect
//
export type MultiSelectProps = Omit<SelectPrimitiveProps, 'isMultiple'>

export const MultiSelect = forwardRef<HTMLButtonElement, MultiSelectProps>(function MultiSelect({
                                                                                                  ...props
                                                                                                }, ref) {
  return (
    <SelectPrimitive
      {...props}
      ref={ref}
      isMultiple={true}
    />
  )
})


export type MultiSelectUncontrolledProps = MultiSelectProps
export const MultiSelectUncontrolled = forwardRef<HTMLButtonElement, MultiSelectUncontrolledProps>(function MultiSelectUncontrolled({
                                                                                                                                      value: initialValue,
                                                                                                                                      onSelectionChanged,
                                                                                                                                      ...props
                                                                                                                                    }, ref) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <MultiSelect
      {...props}
      ref={ref}
      value={value}
      onSelectionChanged={value => {
        setValue(value)
        onSelectionChanged?.(value)
      }}
    />
  )
})