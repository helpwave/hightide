import type { CSSProperties, ReactNode, RefObject } from 'react'
import { createRef, useRef } from 'react'

export type OptionVisual = {
  className?: string,
  style?: CSSProperties,
  content?: ReactNode,
}

export type SelectionOptionData<T> = {
  id: string,
  value: T,
  label: string,
  disabled?: boolean,
  visual?: OptionVisual,
}

type SelectionOptionIdentity<T> =
  [T] extends [string]
    ? { id?: string, label?: string }
    : [string] extends [T]
      ? { id?: string, label?: string }
      : { id: string, label: string }

export type SelectionOptionInput<T> = {
  value: T,
  disabled?: boolean,
  visual?: OptionVisual,
} & SelectionOptionIdentity<T>

export type SelectionListElementProps<T> = {
  option: SelectionOptionData<T>,
  optionRef: RefObject<HTMLLIElement | null>,
  isSelected: boolean,
  isHighlighted: boolean,
  isVisible: boolean,
}

export function normalizeSelectionOptions<T>(
  options: ReadonlyArray<SelectionOptionInput<T>>
): SelectionOptionData<T>[] {
  return options.map((option) => {
    const id = option.id ?? (typeof option.value === 'string' ? option.value : '')
    const label = option.label ?? (typeof option.value === 'string' ? option.value : id)
    return {
      id,
      value: option.value,
      label,
      disabled: option.disabled,
      visual: option.visual,
    }
  })
}

export function useOptionRefs(ids: readonly string[]): Record<string, RefObject<HTMLLIElement | null>> {
  const store = useRef<Record<string, RefObject<HTMLLIElement | null>>>({})
  const cache = useRef<{ key: string, refs: Record<string, RefObject<HTMLLIElement | null>> }>({
    key: '',
    refs: {},
  })
  const idsKey = ids.join('\u0000')
  if (cache.current.key !== idsKey) {
    const next: Record<string, RefObject<HTMLLIElement | null>> = {}
    for (const id of ids) {
      next[id] = store.current[id] ?? createRef<HTMLLIElement>()
    }
    store.current = next
    cache.current = { key: idsKey, refs: next }
  }
  return cache.current.refs
}

export function scrollHighlightedOption(
  highlightedId: string | null,
  optionRefs: Record<string, RefObject<HTMLLIElement | null>>,
  listboxId: string,
  searchInputId?: string
) {
  if (!highlightedId) return
  const node = optionRefs[highlightedId]?.current
  if (!node) return
  node.scrollIntoView({ block: 'nearest' })
  const active = document.activeElement
  if (searchInputId) {
    const search = document.getElementById(searchInputId)
    if (search && (active === search || search.contains(active))) return
  }
  const listbox = document.getElementById(listboxId)
  if (listbox && (active === listbox || listbox.contains(active))) {
    node.focus()
  }
}
