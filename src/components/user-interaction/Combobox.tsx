import type { HTMLAttributes, ReactNode, RefObject } from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from 'react'
import { forwardRef } from 'react'
import clsx from 'clsx'
import { MultiSearchWithMapping } from '@/src/utils/simpleSearch'
import { Input } from '@/src/components/user-interaction/input/Input'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'

type RegisteredOption = {
  value: string,
  label: string,
  display?: ReactNode,
  ref: React.RefObject<HTMLLIElement>,
}

type ComboboxContextIds = {
  root: string,
  listbox: string,
}

type ComboboxContextType = {
  ids: ComboboxContextIds,
  searchString: string,
  setSearchString: (s: string) => void,
  options: RegisteredOption[],
  visibleOptions: RegisteredOption[],
  registerOption: (option: Omit<RegisteredOption, 'ref'> & { ref: React.RefObject<HTMLLIElement> }) => () => void,
  highlightedValue: string | undefined,
  highlightItem: (value: string) => void,
  moveHighlightedIndex: (delta: number) => void,
  onItemClick: (id: string) => void,
  listRef: React.RefObject<HTMLUListElement | null>,
}

const ComboboxContext = createContext<ComboboxContextType | null>(null)

function useComboboxContext() {
  const ctx = useContext(ComboboxContext)
  if (!ctx) {
    throw new Error('Combobox components must be used within ComboboxRoot')
  }
  return ctx
}

export interface ComboboxRootProps {
  children: ReactNode,
  onItemClick: (id: string) => void,
  id?: string,
}

export function ComboboxRoot({ children, onItemClick, id: idProp }: ComboboxRootProps) {
  const generatedId = useId()
  const rootId = idProp ?? `combobox-${generatedId}`
  const listboxId = `${rootId}-listbox`

  const [searchString, setSearchString] = useState('')
  const [options, setOptions] = useState<RegisteredOption[]>([])
  const [highlightedValue, setHighlightedValue] = useState<string | undefined>(undefined)
  const listRef = useRef<HTMLUListElement>(null)

  const visibleOptions = useMemo(() => {
    const q = searchString.trim().toLowerCase()
    if (!q) return options
    return MultiSearchWithMapping(searchString, options, o => [o.label])
  }, [options, searchString])

  const registerOption = useCallback((option: RegisteredOption) => {
    setOptions(prev => {
      const next = prev.filter(o => o.value !== option.value)
      next.push(option)
      next.sort((a, b) => {
        const aEl = a.ref.current
        const bEl = b.ref.current
        if (!aEl || !bEl) return 0
        return aEl.compareDocumentPosition(bEl) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
      })
      return next
    })
    return () => setOptions(prev => prev.filter(o => o.value !== option.value))
  }, [])

  const highlightItem = useCallback((value: string) => {
    setHighlightedValue(value)
  }, [])

  const moveHighlightedIndex = useCallback((delta: number) => {
    setHighlightedValue(prev => {
      const list = visibleOptions
      if (list.length === 0) return undefined
      const idx = list.findIndex(o => o.value === prev)
      const nextIdx = idx < 0 ? 0 : (idx + delta + list.length) % list.length
      return list[nextIdx]?.value
    })
  }, [visibleOptions])

  useEffect(() => {
    const inList = visibleOptions.some(o => o.value === highlightedValue)
    if (!inList && visibleOptions.length > 0) {
      setHighlightedValue(visibleOptions[0].value)
    } else if (!inList) {
      setHighlightedValue(undefined)
    }
  }, [highlightedValue, visibleOptions])

  useEffect(() => {
    if (!highlightedValue) return
    const opt = visibleOptions.find(o => o.value === highlightedValue)
    opt?.ref.current?.scrollIntoView({ behavior: 'instant', block: 'nearest' })
  }, [highlightedValue, visibleOptions])

  const value: ComboboxContextType = useMemo(() => ({
    ids: { root: rootId, listbox: listboxId },
    searchString,
    setSearchString,
    options,
    visibleOptions,
    registerOption,
    highlightedValue,
    highlightItem,
    moveHighlightedIndex,
    onItemClick,
    listRef,
  }), [
    rootId,
    listboxId,
    searchString,
    options,
    visibleOptions,
    registerOption,
    highlightedValue,
    highlightItem,
    moveHighlightedIndex,
    onItemClick,
  ])

  return (
    <ComboboxContext.Provider value={value}>
      <div id={rootId} data-name="combobox-root" className="flex flex-col">
        {children}
      </div>
    </ComboboxContext.Provider>
  )
}

export interface ComboboxInputProps extends Omit<React.ComponentProps<typeof Input>, 'value' | 'onValueChange'> {
  value?: string,
  onValueChange?: (value: string) => void,
}

export const ComboboxInput = forwardRef<HTMLInputElement, ComboboxInputProps>(function ComboboxInput(props, ref) {
  const translation = useHightideTranslation()
  const {
    searchString,
    setSearchString,
    visibleOptions,
    highlightedValue,
    moveHighlightedIndex,
    onItemClick,
    ids,
  } = useComboboxContext()

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    props.onKeyDown?.(event)
    switch (event.key) {
    case 'ArrowDown':
      moveHighlightedIndex(1)
      event.preventDefault()
      break
    case 'ArrowUp':
      moveHighlightedIndex(-1)
      event.preventDefault()
      break
    case 'Enter':
      if (highlightedValue) {
        onItemClick(highlightedValue)
        event.preventDefault()
      }
      break
    default:
      break
    }
  }, [props, moveHighlightedIndex, highlightedValue, onItemClick])

  return (
    <Input
      {...props}
      ref={ref}
      value={searchString}
      onValueChange={setSearchString}
      onKeyDown={handleKeyDown}

      placeholder={props.placeholder ?? translation('search')}

      role="combobox"
      aria-expanded={visibleOptions.length > 0}
      aria-controls={ids.listbox}
      aria-activedescendant={highlightedValue ? `highlightedValue` : undefined}
      aria-autocomplete="list"
    />
  )
})

export type ComboboxListProps = HTMLAttributes<HTMLUListElement>

export const ComboboxList = forwardRef<HTMLUListElement, ComboboxListProps>(function ComboboxList(
  { children, className, ...props },
  ref
) {
  const { ids, listRef } = useComboboxContext()

  const setRefs = useCallback((node: HTMLUListElement | null) => {
    (listRef as RefObject<HTMLUListElement | null>).current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) (ref as RefObject<HTMLUListElement | null>).current = node
  }, [ref, listRef])

  return (
    <ul
      {...props}
      ref={setRefs}
      id={ids.listbox}
      role="listbox"
      aria-label="Options"
      tabIndex={-1}
      data-name="combobox-list"
      className={className}
    >
      {children}
    </ul>
  )
})

export interface ComboboxOptionProps extends Omit<HTMLAttributes<HTMLLIElement>, 'children'> {
  value: string,
  label: string,
  children?: ReactNode,
}

export const ComboboxOption = forwardRef<HTMLLIElement, ComboboxOptionProps>(function ComboboxOption(
  { children, value, label, className, ...restProps },
  ref
) {
  const { visibleOptions, registerOption, highlightItem, onItemClick, highlightedValue } = useComboboxContext()
  const itemRef = useRef<HTMLLIElement>(null)

  const display = children ?? label

  useEffect(() => {
    const unregister = registerOption({
      value,
      label,
      display,
      ref: itemRef,
    })
    return unregister
  }, [value, label, registerOption, display])

  const isVisible = visibleOptions.some(o => o.value === value)
  const highlighted = highlightedValue === value

  return (
    <li
      {...restProps}
      ref={node => {
        itemRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) (ref as RefObject<HTMLLIElement | null>).current = node
      }}
      id={value}
      role="option"
      aria-selected={highlighted}
      aria-hidden={!isVisible}
      data-name="combobox-option"
      data-highlighted={highlighted ? '' : undefined}
      data-visible={isVisible ? '' : undefined}
      className={clsx(!isVisible && 'hidden', className)}
      onClick={event => {
        onItemClick(value)
        restProps.onClick?.(event)
      }}
      onMouseEnter={event => {
        highlightItem(value)
        restProps.onMouseEnter?.(event)
      }}
    >
      {display}
    </li>
  )
})

ComboboxOption.displayName = 'ComboboxOption'

export interface ComboboxProps {
  children: ReactNode,
  onItemClick: (id: string) => void,
  id?: string,
  inputProps?: ComboboxInputProps,
  listProps?: ComboboxListProps,
}

export function Combobox({ children, onItemClick, id, inputProps, listProps }: ComboboxProps) {
  return (
    <ComboboxRoot id={id} onItemClick={onItemClick}>
      <ComboboxInput {...inputProps} />
      <ComboboxList {...listProps}>{children}</ComboboxList>
    </ComboboxRoot>
  )
}
