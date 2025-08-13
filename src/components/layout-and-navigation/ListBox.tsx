import type { HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { clsx } from 'clsx'
import { CheckIcon } from 'lucide-react'
import { match } from '@/src/utils/match'
import type { BagFunctionOrNode } from '@/src/utils/bagFunctions'
import { BagFunctionUtil } from '@/src/utils/bagFunctions'

type ListBoxItemBag = {
  disabled: boolean,
  isSelected: boolean,
  isHighlighted: boolean,
}

/*
 * ListBoxItem
 */
interface ListBoxItemProps extends Omit<HTMLAttributes<HTMLLIElement>, 'children'> {
  children: BagFunctionOrNode<ListBoxItemBag>,
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
  const bag: ListBoxItemBag = {
    disabled,
    isSelected,
    isHighlighted
  }

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
          size={16}
          className={clsx('size-force-4 transition-opacity motion-safe:duration-200 motion-reduce:duration-0', {
            'opacity-0': !isSelected,
          })}
          aria-hidden="true"
        />
      )}
      {BagFunctionUtil.resolve(children ?? value, bag)}
    </li>
  )
})

export type ListBoxItemType = {
  value: string,
  display?: ReactNode,
  disabled?: boolean,
}

export type ListBoxDirection = 'horizontal' | 'vertical' | 'horizontalInverse' | 'verticalInverse'

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
  isSelection?: boolean, // TODO consider moving the selection features out of this component
  isMultiple?: boolean,
  startIndex?: number,
  direction?: ListBoxDirection,
}

export const ListBoxPrimitive = forwardRef<HTMLUListElement, ListBoxPrimitiveProps>(function ListBoxPrimitive({
                                                                                                                value,
                                                                                                                options,
                                                                                                                onItemClicked,
                                                                                                                onSelectionChanged,
                                                                                                                isSelection,
                                                                                                                isMultiple = false,
                                                                                                                startIndex,
                                                                                                                direction = 'vertical',
                                                                                                                ...restProps
                                                                                                              }, ref) {
  const [highlightedIndex, setHighlightedIndex] = useState<number>()
  const itemRefsMap = useRef(new Map<number, HTMLLIElement | null>())
  const [isKeyboardNavigating, setIsKeyboardNavigating] = useState(true)

  // TODO add type ahead support

  useEffect(() => {
    if (highlightedIndex !== undefined) {
      itemRefsMap.current[highlightedIndex].scrollIntoView({ behavior: 'auto' })
    }
  }, [highlightedIndex])

  const clickWrapper = (clickedItem: ListBoxItemType) => {
    onItemClicked?.(clickedItem.value)
    if (isSelection) {
      if (!isMultiple) {
        onSelectionChanged([clickedItem.value])
        return
      }

      if (!value) {
        onSelectionChanged([clickedItem.value])
      } else {
        const selected = value.some(selected => selected === clickedItem.value)
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
      ref={ref}
      {...restProps}
      className={clsx(
        'max-h-128',
        {
          'flex-col-0': direction === 'vertical',
          'flex-row-0': direction === 'horizontal',
        },
        restProps.className
      )}
      onFocus={event => {
        if (startIndex !== undefined) {
          setHighlightedIndex(startIndex)
          return
        }
        if (isSelection && value) {
          const firstSelected = options.findIndex(option => value.some(selected => selected === option.value) && !option.disabled)
          setHighlightedIndex(firstSelected !== -1 ? firstSelected : 0)
        } else {
          setHighlightedIndex(0)
        }
        restProps.onFocus?.(event)
      }}
      onBlur={(event) => {
        setHighlightedIndex(undefined)
        restProps.onBlur?.(event)
      }}
      onKeyDown={(event) => {
        switch (event.key) {
          case match(direction, {
            horizontal: 'ArrowRight',
            vertical: 'ArrowDown',
            horizontalInverse: 'ArrowLeft',
            verticalInverse: 'ArrowUp',
          }): {
            const startIndex = (highlightedIndex ?? -1) + 1
            for (let i = 0; i < options.length; i++) {
              const index = (startIndex + i) % options.length
              if (!options[index].disabled) {
                setHighlightedIndex(index)
                break
              }
            }
            setIsKeyboardNavigating(true)
            event.preventDefault()
            break
          }
          case match(direction, {
            horizontal: 'ArrowLeft',
            vertical: 'ArrowUp',
            horizontalInverse: 'ArrowRight',
            verticalInverse: 'ArrowDown',
          }): {
            const startIndex = (highlightedIndex ?? 0) - 1
            for (let i = 0; i < options.length; i++) {
              const index = (startIndex + options.length - i) % options.length
              if (!options[index].disabled) {
                setHighlightedIndex(index)
                break
              }
            }
            setIsKeyboardNavigating(true)
            event.preventDefault()
            break
          }
          case 'Home':
            setHighlightedIndex(0)
            setIsKeyboardNavigating(true)
            event.preventDefault()
            break
          case 'End':
            setHighlightedIndex(options.length - 1)
            setIsKeyboardNavigating(true)
            event.preventDefault()
            break
          case 'Enter': // fall through
          case ' ':
            if (highlightedIndex !== undefined) {
              event.preventDefault()
              clickWrapper(options[highlightedIndex])
            }
            break
          default:
            break
        }
        restProps.onKeyDown?.(event)
      }}
      onMouseMove={event => {
        setIsKeyboardNavigating(false)
        restProps.onMouseMove?.(event)
      }}

      role="listbox"
      tabIndex={0}

      aria-multiselectable={isSelection ? isMultiple : undefined}
      aria-orientation={direction.startsWith('horizontal') ? 'horizontal' : 'vertical'}
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
          isSelected={isSelection && (value ?? []).some(selected => selected === option.value)}
          isHighlighted={highlightedIndex === index}
          onClick={() => {
            if (option.disabled) return
            setHighlightedIndex(index)
            clickWrapper(option)
          }}
          onMouseEnter={() => {
            if (option.disabled || isKeyboardNavigating) return
            setHighlightedIndex(index)
          }}
          onMouseMove={() => {
            if (!isKeyboardNavigating) {
              setIsKeyboardNavigating(false)
              if (option.disabled || isKeyboardNavigating) return
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
})

/*
 * ListBoxMultiple
 */
export type ListBoxMultipleProps = Omit<ListBoxPrimitiveProps, 'isMultiple'>
export const ListBoxMultiple = ({ ...props }: ListBoxMultipleProps) => {
  return (
    <ListBoxPrimitive {...props}/>
  )
}

export type ListBoxMultipleUncontrolledProps = ListBoxMultipleProps
export const ListBoxMultipleUncontrolled = ({
                                              value: initialValue,
                                              onSelectionChanged,
                                              ...props
                                            }: ListBoxMultipleUncontrolledProps) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <ListBoxMultiple
      {...props}
      value={value}
      onSelectionChanged={(newValue) => {
        setValue(newValue)
        onSelectionChanged?.(newValue)
      }}
    />
  )
}

export type ListBoxProps = Omit<ListBoxPrimitiveProps, 'isMultiple' | 'value' | 'onSelectionChanged'> & {
  value?: string,
  onSelectionChanged?: (value: string) => void,
}
export const ListBox = forwardRef<HTMLUListElement, ListBoxProps>(function ListBox({
                                                                                     value,
                                                                                     onSelectionChanged,
                                                                                     ...props
                                                                                   }, ref) {
  return (
    <ListBoxPrimitive
      ref={ref}
      value={value !== undefined ? [value] : undefined}
      onSelectionChanged={(newValue) => {
        onSelectionChanged(newValue[0] ?? value)
      }}
      isMultiple={false}
      {...props}
    />
  )
})

export type ListBoxUncontrolledProps = ListBoxProps
export const ListBoxUncontrolled = ({
                                      value: initialValue,
                                      onSelectionChanged,
                                      ...props
                                    }: ListBoxUncontrolledProps) => {
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