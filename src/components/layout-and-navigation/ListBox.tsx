import type { HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { clsx } from 'clsx'
import { CheckIcon } from 'lucide-react'

/*
 * ListBoxItem
 */
interface ListBoxItemProps extends HTMLAttributes<HTMLLIElement> {
  value: string,
  disabled?: boolean,
  isHighlighted?: boolean,
  isSelected?: boolean,
  hasSelectIcon?: boolean,
}

export const ListBoxItem = forwardRef<HTMLLIElement, ListBoxItemProps>(function ListBoxItem({
                                                                                              children,
                                                                                              value,
                                                                                              isHighlighted = false,
                                                                                              isSelected = false,
                                                                                              disabled = false,
                                                                                              hasSelectIcon = false,
                                                                                              className,
                                                                                              ...props
                                                                                            }, ref) {
  return (
    <li
      ref={ref}
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
      {...props}
    >
      {hasSelectIcon && (
        <CheckIcon
          size={18}
          className={clsx('size-force-4.5', {
            'opacity-0': !isSelected,
          })}
          aria-hidden="true"
        />
      )}
      {children ?? value}
    </li>
  )
})

export type ListBoxItemType = {
  value: string,
  display?: ReactNode,
  disabled?: boolean,
}

/*
 * ListBoxPrimitive
 */
export type ListBoxPrimitiveProps = HTMLAttributes<HTMLUListElement> & {
  value?: string[],
  options: ListBoxItemType[],
  onItemClicked?: (value: string) => void,
  onSelectionChanged?: (value: string[]) => void,
  /**
   * Whether the ListBox should manage a selection state
   */
  isSelection?: boolean,
  isMultiple?: boolean,
}

export const ListBoxPrimitive = ({
                                   value,
                                   options,
                                   onItemClicked,
                                   onSelectionChanged,
                                   isSelection,
                                   isMultiple = false,
                                   ...restProps
                                 }: ListBoxPrimitiveProps) => {
  const [highlightedIndex, setHighlightedIndex] = useState<number>()
  const itemRefsMap = useRef(new Map<number, HTMLLIElement | null>())
  const [isKeyboardNavigating, setIsKeyboardNavigating] = useState(false)

  // TODO add type ahead support

  useEffect(() => {
    if (highlightedIndex !== undefined) {
      itemRefsMap.current[highlightedIndex].scrollIntoView({ block: 'nearest' })
    }
  }, [highlightedIndex])

  const clickWrapper = (clickedItem: ListBoxItemType) => {
    onItemClicked(clickedItem.value)
    if (isSelection) {
      if(!isMultiple) {
        onSelectionChanged([clickedItem.value])
        return
      }

      if (!value) {
        onSelectionChanged([clickedItem.value])
      } else {
        const selected = value.find(selected => selected === clickedItem.value) !== undefined
        if (selected) {
          onSelectionChanged(value.filter(selected => selected !== clickedItem.value))
        } else {
          onSelectionChanged([...value, clickedItem.value])
        }
      }
    }
  }

  return (
    <ul
      {...restProps}

      className={clsx(
        'flex-col-1 max-h-128 overflow-y-scroll',
        restProps.className
      )}
      onFocus={() => {
        if (isSelection && value) {
          const firstSelected = options.findIndex(option => !value.findIndex(selected => selected === option.value) && !option.disabled)
          setHighlightedIndex(firstSelected !== -1 ? firstSelected : 0)
        } else {
          setHighlightedIndex(0)
        }
      }}
      onKeyDown={(e) => {
        switch (e.key) {
          case 'ArrowDown': {
            const startIndex = (highlightedIndex ?? -1) + 1
            for (let i = 0; i < options.length; i++) {
              const index = (startIndex + i) % options.length
              if (!options[index].disabled) {
                setHighlightedIndex(index)
                break
              }
            }
            setIsKeyboardNavigating(true)
            e.preventDefault()
            break
          }
          case 'ArrowUp': {
            const startIndex = (highlightedIndex ?? 0) - 1
            for (let i = 0; i < options.length; i++) {
              const index = (startIndex + options.length - i) % options.length
              if (!options[index].disabled) {
                setHighlightedIndex(index)
                break
              }
            }
            setIsKeyboardNavigating(true)
            e.preventDefault()
            break
          }
          case 'Home':
            setHighlightedIndex(0)
            setIsKeyboardNavigating(true)
            e.preventDefault()
            break
          case 'End':
            setHighlightedIndex(options.length - 1)
            setIsKeyboardNavigating(true)
            e.preventDefault()
            break
          case 'Enter': // fall through
          case ' ':
            if (highlightedIndex) {
              e.preventDefault()
              clickWrapper(options[highlightedIndex])
            }
            break
          default:
            break
        }
      }}
      onMouseMove={() => {
        setIsKeyboardNavigating(false)
      }}

      role="listbox"
      tabIndex={0}

      aria-multiselectable={isSelection ? isMultiple : undefined}
      aria-activedescendant={options[highlightedIndex]?.value}
    >
      {options.map((option, index) => (
        <ListBoxItem
          key={index}
          ref={instance => {
            itemRefsMap.current[index] = instance
          }}
          value={option.value}
          disabled={option.disabled}
          isSelected={isSelection && (value ?? []).find(selected => selected === option.value) !== undefined}
          isHighlighted={highlightedIndex === index}
          onClick={() => {
            if(option.disabled) return
            setHighlightedIndex(index)
            clickWrapper(option)
          }}
          onMouseEnter={() => {
            if(option.disabled || isKeyboardNavigating) return
            setHighlightedIndex(index)
          }}
          onMouseMove={() => {
            if(!isKeyboardNavigating) {
              setIsKeyboardNavigating(false)
              if(option.disabled || isKeyboardNavigating) return
              setHighlightedIndex(index)
            }
          }}
          hasSelectIcon={isSelection}
        >
          {option.display}
        </ListBoxItem>
      ))}
    </ul>
  )
}

export type ListBoxMultipleProps = Omit<ListBoxPrimitiveProps, 'isMultiple'>
export const ListBoxMultiple = ({ ...props }: ListBoxMultipleProps) => {
  return (
    <ListBoxPrimitive {...props}/>
  )
}

export type ListBoxProps = Omit<ListBoxPrimitiveProps, 'isMultiple' | 'value' | 'onSelectionChanged'> & {
  value?: string,
  onSelectionChanged?: (value: string) => void,
}
export const ListBox = ({
                          value,
                          onSelectionChanged,
                          ...props
                        }: ListBoxProps) => {
  return (
    <ListBoxPrimitive
      value={value !== undefined ? [value] : undefined}
      onSelectionChanged={(newValue) => {
        onSelectionChanged(newValue[0] ?? value)
      }}
      isMultiple={false}
      {...props}
    />
  )
}

export type ListBoxUncontrolledProps = ListBoxProps
export const ListBoxUncontrolled = ({
                                      value: initialValue,
                                      onSelectionChanged,
                                      ...props
                                    }: ListBoxProps) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <ListBox
      {...props}
      value={value}
      onSelectionChanged={(newValue) => {
        setValue(newValue)
        onSelectionChanged?.(newValue)
      }}
    />
  )
}