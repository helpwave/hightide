import type { SelectionOptionData } from '../option'

export function visibleRowSpan(visibleRows: number) {
  return Number.isFinite(visibleRows) ? Math.max(0, visibleRows) : 1
}

export function wrappedOptions<T>(
  options: readonly SelectionOptionData<T>[],
  start: number,
  count: number
) {
  if (options.length === 0 || count <= 0) {
    return []
  }
  const wrapped: SelectionOptionData<T>[] = []
  for (let offset = 0; offset < count; offset += 1) {
    const index = ((start + offset) % options.length + options.length) % options.length
    const option = options[index]
    if (option) {
      wrapped.push(option)
    }
  }
  return wrapped
}

export function itemHeightOf<T>(
  options: readonly SelectionOptionData<T>[],
  elements: Record<string, HTMLElement | null>
) {
  const first = options[0]
  if (!first) {
    return 0
  }
  return elements[first.id]?.offsetHeight ?? 0
}

export function resolveStep(currentIndex: number, steps: number, length: number, isLooping: boolean) {
  const raw = currentIndex + steps
  if (!isLooping || length <= 0) {
    return {
      index: Math.max(0, Math.min(length - 1, raw)),
      loops: 0,
    }
  }
  return {
    index: ((raw % length) + length) % length,
    loops: Math.floor(raw / length),
  }
}

export function paintOptions<T>(
  options: readonly SelectionOptionData<T>[],
  elements: Record<string, HTMLElement | null>,
  scrollTop: number
) {
  const itemHeight = itemHeightOf(options, elements)
  if (itemHeight <= 0) {
    return
  }
  const centeredIndex = Math.round(scrollTop / itemHeight)
  options.forEach((option, index) => {
    elements[option.id]?.toggleAttribute('data-centered', index === centeredIndex)
  })
}
