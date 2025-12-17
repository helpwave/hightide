import type { HTMLAttributes, RefObject } from 'react'
import React, { createContext, forwardRef, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { clsx } from 'clsx'
import { match } from '@/src/utils/match'
import { useOverwritableState } from '@/src/hooks/useOverwritableState'

//
// Context
//
type RegisteredItem = {
  id: string,
  value: string,
  disabled: boolean,
  ref: React.RefObject<HTMLLIElement>,
}

type ListBoxContextType = {
  registerItem: (item: RegisteredItem) => void,
  unregisterItem: (id: string) => void,

  highlightedId?: string,
  setHighlightedId: (id: string) => void,

  onItemClick: (id: string) => void,
  isSelected: (value: string) => boolean,
}

const ListBoxContext = createContext<ListBoxContextType | null>(null)

function useListBoxContext() {
  const ctx = useContext(ListBoxContext)
  if (!ctx) {
    throw new Error('ListBoxItem must be used within a ListBoxPrimitive')
  }
  return ctx
}


/*
 * ListBoxItem
 */
export type ListBoxItemProps = HTMLAttributes<HTMLLIElement> & {
  value: string,
  disabled?: boolean,
}

export const ListBoxItem = forwardRef<HTMLLIElement, ListBoxItemProps>(
  function ListBoxItem({ value, disabled = false, children, className, ...rest }, ref) {
    const {
      registerItem,
      unregisterItem,
      highlightedId,
      setHighlightedId,
      onItemClick,
      isSelected,
    } = useListBoxContext()

    const itemRef = useRef<HTMLLIElement>(null)
    const id = React.useId()

    // Register with parent
    useEffect(() => {
      registerItem({ id, value, disabled, ref: itemRef })
      return () => unregisterItem(id)
    }, [id, value, disabled, registerItem, unregisterItem])

    const isHighlighted = highlightedId === id
    const selected = isSelected(value)

    return (
      <li
        ref={(node) => {
          itemRef.current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as RefObject<HTMLLIElement | null>).current = node
        }}
        id={id}
        role="option"
        aria-disabled={disabled}
        aria-selected={selected}
        data-highlighted={isHighlighted ? '' : undefined}
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

type ListBoxOrientation = 'vertical' | 'horizontal'

//
// ListBoxPrimitive
//
export type ListBoxPrimitiveProps = HTMLAttributes<HTMLUListElement> & {
  value?: string[],
  onItemClicked?: (value: string) => void,
  onSelectionChanged?: (value: string[]) => void,
  isSelection?: boolean,
  isMultiple?: boolean,
  orientation?: ListBoxOrientation,
}


export const ListBoxPrimitive = forwardRef<HTMLUListElement, ListBoxPrimitiveProps>(
  function ListBoxPrimitive({
                              value,
                              onSelectionChanged,
                              onItemClicked,
                              isSelection = false,
                              isMultiple = false,
                              orientation = 'vertical',
                              ...props
                            }, ref) {
    const itemsRef = useRef<RegisteredItem[]>([])
    const [highlightedIndex, setHighlightedIndex] = useState<number | undefined>(undefined)

    const registerItem = useCallback((item: RegisteredItem) => {
      itemsRef.current.push(item)
      itemsRef.current.sort((a, b) => {
        const aEl = a.ref.current
        const bEl = b.ref.current
        if (!aEl || !bEl) return 0
        return aEl.compareDocumentPosition(bEl) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
      })
    }, [])

    const unregisterItem = useCallback((id: string) => {
      itemsRef.current = itemsRef.current.filter(i => i.id !== id)
    }, [])

    const isSelected = useCallback(
      (val: string) => (value ?? []).includes(val),
      [value]
    )

    const onItemClickedHandler = useCallback(
      (id: string) => {
        const index = itemsRef.current.findIndex(i => i.id === id)
        if (index === -1) {
          console.error('ListBoxItem provided an invalid id')
          return
        }
        const item = itemsRef.current[index]
        const val = item.value
        onItemClicked?.(val)
        setHighlightedIndex(index)
        if (!isSelection) return
        if (!isMultiple) {
          onSelectionChanged?.([val])
        } else {
          if (isSelected(val)) {
            onSelectionChanged?.((value ?? []).filter(v => v !== val))
          } else {
            onSelectionChanged?.([...(value ?? []), val])
          }
        }
      },
      [onItemClicked, isSelection, isMultiple, onSelectionChanged, isSelected, value]
    )

    const setHighlightedId = useCallback((id: string) => {
      const index = itemsRef.current.findIndex(i => i.id === id)
      if (index !== -1) {
        setHighlightedIndex(index)
      }
    }, [])

    // Scroll highlighted item into view
    useEffect(() => {
      if (highlightedIndex !== undefined) {
        itemsRef.current[highlightedIndex]?.ref.current?.scrollIntoView({ block: 'nearest', behavior: 'auto' })
      }
    }, [highlightedIndex])

    const highlightedItem: RegisteredItem | undefined = itemsRef.current[highlightedIndex]
    const ctxValue: ListBoxContextType = {
      registerItem,
      unregisterItem,
      highlightedId: highlightedItem?.id,
      setHighlightedId,
      onItemClick: onItemClickedHandler,
      isSelected,
    }

    const moveHighlight = (delta: number) => {
      if (itemsRef.current.length === 0) return
      let nextIndex = highlightedIndex ?? -1
      for (let i = 0; i < itemsRef.current.length; i++) {
        nextIndex = (nextIndex + delta + itemsRef.current.length) % itemsRef.current.length
        if (!itemsRef.current[nextIndex].disabled) break
      }
      setHighlightedIndex(nextIndex)
    }

    return (
      <ListBoxContext.Provider value={ctxValue}>
        <ul
          ref={ref}
          {...props}
          onFocus={event => {
            if (highlightedIndex === undefined) {
              const firstEnabled = itemsRef.current.findIndex(i => !i.disabled)
              setHighlightedIndex(firstEnabled !== -1 ? firstEnabled : undefined)
            }
            props.onFocus?.(event)
          }}
          onBlur={event => {
            setHighlightedIndex(undefined)
            props.onBlur?.(event)
          }}
          onKeyDown={(event) => {
            switch (event.key) {
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
                setHighlightedIndex(itemsRef.current.findIndex(i => !i.disabled))
                event.preventDefault()
                break
              case 'End':
                for (let i = itemsRef.current.length - 1; i >= 0; i--) {
                  if (!itemsRef.current[i].disabled) {
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
                  onItemClickedHandler(itemsRef.current[highlightedIndex].id)
                }
                break
            }
            props.onKeyDown?.(event)
          }}
          role="listbox"
          aria-multiselectable={isSelection ? isMultiple : undefined}
          aria-orientation={orientation}
          tabIndex={0}
        >
          {props.children}
        </ul>
      </ListBoxContext.Provider>
    )
  }
)

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
  const [value, setValue] = useOverwritableState(initialValue, onSelectionChanged)

  return (
    <ListBoxMultiple
      {...props}
      value={value}
      onSelectionChanged={setValue}
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
  const [value, setValue] = useOverwritableState(initialValue, onSelectionChanged)

  return (
    <ListBox
      {...props}
      value={value}
      onSelectionChanged={setValue}
    />
  )
}