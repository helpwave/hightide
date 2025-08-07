import type { HTMLAttributes } from 'react'
import { createContext, useContext, useEffect, useId, useRef, useState } from 'react'
import { useLogOnce } from '@/src/hooks/useLogOnce'
import { clsx } from 'clsx'

/*
 * Context
 */
export interface ListBoxContextType {
  id: string,
  numberOfItems: number,
  registerItem: (id: string, ref: HTMLLIElement | null) => void,
  unregisterItem: (id: string) => void,
  highlightedId?: string,
  setHighlightedId: (id: string) => void,
  onItemClicked: (id: string) => void,
}

export const ListBoxContext = createContext<ListBoxContextType | undefined>(undefined)

export const useListBoxContext = () => {
  const context = useContext(ListBoxContext)
  if (!context) {
    throw new Error('ListBoxItem must be used within a ListBox')
  }
  return context
}


/*
 * ListBoxItem
 */
interface ListBoxItemProps extends HTMLAttributes<HTMLLIElement> {
  value: string,
}

export const ListBoxItem = ({
                              item,
                              ...props,
                            }: ListBoxItemProps) => {
  const ref = useRef<HTMLLIElement>(null)
  const { registerItem, unregisterItem, highlightedId, setHighlightedId, numberOfItems } = useListBoxContext()

  useEffect(() => {
    registerItem(item.value, ref.current)
    return () => unregisterItem(item.value)
  }, [item.value, registerItem, unregisterItem])

  return (
    <li
      id={item.value}
      ref={ref}
      role="option"
      aria-selected={highlightedId === item.value}
      aria-posinset={index + 1}
      aria-setsize={numberOfItems}
      data-highlighted={isHighlighted ? '' : undefined}
      data-disabled={item.disabled ? '' : undefined}
      onMouseEnter={(event) => {
        props.onMouseEnter?.(event)
        if (!item.disabled) setHighlighted({ index, item })
      }}
      onClick={(event) => {
        props.onClick?.(event)
        if (!item.disabled) {
          onItemClick?.(item)
          setHighlighted({ index, item })
        }
      }}
      className={clsx(
        'flex-row-1 items-center px-2 py-1 rounded-md',
        'data-highlighted:bg-primary/20',
        'data-disabled:text-disabled data-disabled:cursor-not-allowed',
        'not-data-disabled:cursor-pointer',
        props.className
      )}
      {...props}
    >
      {item.label ?? item.value}
    </li>
  )
}

/*
 * ListBox
 */
export interface ListBoxItem {
  value: string,
  label?: ReactNode,
  disabled?: boolean,
}

export interface HighlightedState {
  index: number,
  item: ListBoxItem,
}

export type ListBoxProps = HTMLAttributes<HTMLUListElement> & {
  options: ListBoxItem[],
  onItemClick?: (item: ListBoxItem) => void,
  initialState?: HighlightedState,
}

export const ListBox = ({
                          id: providedId,
                          options,
                          onItemClick,
                          initialState,
                          ...restProps
                        }: ListBoxProps) => {
  const generateId = useId()
  const id = providedId ?? generateId
  const listRef = useRef<HTMLUListElement | null>(null)
  const itemRefsMap = useRef(new Map<string, HTMLLIElement | null>())

  const registerItem = (id: string, ref: HTMLLIElement | null) => {
    itemRefsMap.current.set(id, ref)
  }

  const unregisterItem = (id: string) => {
    itemRefsMap.current.delete(id)
  }

  useLogOnce(
    'ListBox requires at least one option',
    options.length === 0,
    { type: 'error' }
  )
  const [highlighted, setHighlighted] = useState<HighlightedState | undefined>(initialState ?? {
    index: 0,
    item: options[0],
  })

  useEffect(() => {
    if (highlighted === undefined) {
      listRef.current.focus()
    } else if (itemRefs.current[highlighted.index]) {
      itemRefs.current[highlighted.index].scrollIntoView({ block: 'nearest' })
    }
  }, [highlighted])

  return (
    <ListBoxContext.Provider
      value={{
        id: id,
        registerItem,
        unregisterItem,
        highlightedId: highlighted?.item.value,
        setHighlightedId:
      }}
    >
      <ul
        {...restProps}
        id={`${id}-listbox`}
        className={clsx(
          'flex-col-1 max-h-128 overflow-y-scroll'
        )}
        onKeyDown={(e) => {
          let newIndex: number | undefined
          switch (e.key) {
            case 'ArrowDown': {
              const startIndex = (highlighted?.index ?? -1) + 1
              for (let i = 0; i < options.length; i++) {
                const index = (startIndex + i) % options.length
                if (!options[index].disabled) {
                  newIndex = index
                  break
                }
              }
              break
            }
            case 'ArrowUp': {
              const startIndex = (highlighted?.index ?? 0) - 1
              for (let i = 0; i < options.length; i++) {
                const index = (startIndex + options.length - i) % options.length
                if (!options[index].disabled) {
                  newIndex = index
                  break
                }
              }
              break
            }
            case 'Home':
              newIndex = 0
              break
            case 'End':
              newIndex = options.length - 1
              break
            case 'Enter':
            case ' ':
              if (highlighted) {
                e.preventDefault()
                onItemClick(highlighted.item)
              }
              break
            default:
              break
          }
          if (newIndex !== undefined) {
            e.preventDefault()
            if (options.length === 0) {
              setHighlighted(undefined)
            } else {
              setHighlighted({ index: newIndex, item: options[newIndex] })
            }
          }
        }}

        role="listbox"
      >
        {options.map((item, index) => {
          return (
            <li
              id={item.value}
              key={item.value}
              ref={(el) => {
                itemRefs.current[index] = el
              }}

              onMouseEnter={() => {
                if (!item.disabled) {
                  setHighlighted({ index, item })
                }
              }}
              onClick={(e) => {
                if (!item.disabled) {
                  onItemClick(item)
                  setHighlighted({ index, item })
                }
                e.preventDefault()
                e.stopPropagation()
                inputRef.current.focus()
              }}

              role="option"
              aria-posinset={index}
              aria-setsize={options.length}

              data-highlighted={index === highlighted?.index ? '' : undefined}
              data-disabled={item.disabled ? '' : undefined}
              className={clsx(
                'flex-row-1 items-center px-2 py-1 rounded-md',
                'data-highlighted:bg-primary/20',
                'data-disabled:text-disabled data-disabled:cursor-not-allowed',
                'not-data-disabled:cursor-pointer'
              )}
            >
              {item.value}
            </li>
          )
        })}
      </ul>
    </ListBoxContext.Provider>
  )
}