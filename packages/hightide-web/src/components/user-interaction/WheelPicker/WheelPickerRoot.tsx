import type { CSSProperties, HTMLAttributes, ReactElement, ReactNode } from 'react'
import { Children, cloneElement, isValidElement, useCallback, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'

import type { WheelPickerRegisteredOption } from './WheelPickerContext'
import { WheelPickerContextProvider } from './WheelPickerContext'
import { WheelPickerBar } from './WheelPickerBar'
import { WheelPickerPreviewScope } from './WheelPickerOption'

export type WheelPickerLoopEvent<T> = {
  value: T,
  direction: 1 | -1,
  loopedAround: 'start' | 'end',
}

export type WheelPickerRootProps<T> = Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'children' | 'onChange'> & {
  value?: T,
  defaultValue?: T,
  onValueChange?: (value: T) => void,
  onLoop?: (event: WheelPickerLoopEvent<T>) => void,
  disabled?: boolean,
  isLooping?: boolean,
  visibleRows?: number,
  children?: ReactNode,
}

function wrappedNodes(nodes: ReactNode[], start: number, count: number) {
  if (nodes.length === 0 || count <= 0) {
    return []
  }
  return Array.from({ length: count }, (_, offset) => {
    const index = ((start + offset) % nodes.length + nodes.length) % nodes.length
    return nodes[index]
  })
}

function previewCopies(nodes: ReactNode[], prefix: string) {
  return nodes.map((node, index) => {
    if (!isValidElement(node)) {
      return node
    }
    return cloneElement(node, { key: `${prefix}-${index}` })
  })
}

function isWheelPickerBar(node: ReactNode): node is ReactElement {
  return isValidElement(node) && node.type === WheelPickerBar
}

function orderedOptions<T>(options: WheelPickerRegisteredOption<T>[]) {
  return options.slice().sort((left, right) => {
    if (left.element === right.element) {
      return 0
    }
    const position = left.element.compareDocumentPosition(right.element)
    return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
  })
}

function itemHeightOf<T>(options: WheelPickerRegisteredOption<T>[]) {
  return options[0]?.element.offsetHeight ?? 0
}

function resolveStep(currentIndex: number, steps: number, length: number, isLooping: boolean) {
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

function paintOptions<T>(options: WheelPickerRegisteredOption<T>[], scrollTop: number) {
  const itemHeight = itemHeightOf(options)
  if (itemHeight <= 0) {
    return
  }
  const centeredIndex = Math.round(scrollTop / itemHeight)
  options.forEach((option, index) => {
    option.element.toggleAttribute('data-centered', index === centeredIndex)
  })
}

export function WheelPickerRoot<T>({
  value,
  defaultValue,
  onValueChange,
  onLoop,
  disabled = false,
  isLooping = false,
  visibleRows = 1,
  className,
  children,
  onKeyDown,
  style,
  ...props
}: WheelPickerRootProps<T>) {
  const listboxId = useId()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const optionsRef = useRef<WheelPickerRegisteredOption<T>[]>([])
  const userScrollingRef = useRef(false)
  const onValueChangeRef = useRef(onValueChange)
  const onLoopRef = useRef(onLoop)
  const isLoopingRef = useRef(isLooping)
  const [uncontrolled, setUncontrolled] = useState(defaultValue)
  const [options, setOptions] = useState<WheelPickerRegisteredOption<T>[]>([])
  const optionsPublishScheduled = useRef(false)
  const selected = value !== undefined ? value : uncontrolled
  const selectedRef = useRef(selected)
  selectedRef.current = selected
  onValueChangeRef.current = onValueChange
  onLoopRef.current = onLoop
  isLoopingRef.current = isLooping

  const childList = Children.toArray(children)
  const bars = childList.filter(isWheelPickerBar)
  const items = childList.filter((child) => !isWheelPickerBar(child))

  const applyValue = useCallback((next: T) => {
    if (Object.is(selectedRef.current, next)) {
      return
    }
    selectedRef.current = next
    setUncontrolled(next)
    onValueChangeRef.current?.(next)
  }, [])

  const scrollToIndex = useCallback((index: number, behavior: ScrollBehavior) => {
    const scroller = scrollerRef.current
    const options = orderedOptions(optionsRef.current)
    const itemHeight = itemHeightOf(options)
    if (!scroller || itemHeight <= 0) {
      return
    }
    const top = Math.max(0, Math.min(options.length - 1, index)) * itemHeight
    if (Math.abs(scroller.scrollTop - top) <= 1) {
      paintOptions(options, scroller.scrollTop)
      return
    }
    userScrollingRef.current = behavior === 'smooth'
    scroller.scrollTo({ top, behavior })
    if (behavior === 'auto') {
      paintOptions(options, top)
    }
  }, [])

  const syncToSelected = useCallback((behavior: ScrollBehavior) => {
    if (userScrollingRef.current || disabled) {
      return
    }
    const options = orderedOptions(optionsRef.current)
    if (options.length === 0) {
      return
    }
    const selectedValue = selectedRef.current
    const index = selectedValue === undefined
      ? 0
      : options.findIndex((option) => Object.is(option.value, selectedValue))
    scrollToIndex(index < 0 ? 0 : index, behavior)
  }, [disabled, scrollToIndex])

  const commitFromScroll = useCallback(() => {
    if (disabled) {
      return
    }
    const scroller = scrollerRef.current
    const options = orderedOptions(optionsRef.current)
    const itemHeight = itemHeightOf(options)
    if (!scroller || itemHeight <= 0 || options.length === 0) {
      return
    }
    const index = Math.round(scroller.scrollTop / itemHeight)
    const option = options[Math.max(0, Math.min(options.length - 1, index))]
    if (!option) {
      return
    }
    paintOptions(options, scroller.scrollTop)
    applyValue(option.value)
  }, [applyValue, disabled])

  const stepBy = useCallback((steps: number) => {
    const scroller = scrollerRef.current
    const options = orderedOptions(optionsRef.current)
    const itemHeight = itemHeightOf(options)
    if (!scroller || itemHeight <= 0 || options.length === 0 || steps === 0) {
      return
    }
    const currentIndex = Math.round(scroller.scrollTop / itemHeight)
    const { index, loops } = resolveStep(currentIndex, steps, options.length, isLoopingRef.current)
    const option = options[index]
    if (!option) {
      return
    }
    scrollToIndex(index, 'auto')
    applyValue(option.value)
    if (loops === 0) {
      return
    }
    const direction = loops > 0 ? 1 : -1
    const loopedAround = direction === 1 ? 'end' : 'start'
    for (let count = 0; count < Math.abs(loops); count += 1) {
      onLoopRef.current?.({
        value: option.value,
        direction,
        loopedAround,
      })
    }
  }, [applyValue, scrollToIndex])

  const selectValue = useCallback((next: T) => {
    if (disabled) {
      return
    }
    const options = orderedOptions(optionsRef.current)
    const index = options.findIndex((option) => Object.is(option.value, next))
    if (index < 0) {
      return
    }
    scrollToIndex(index, 'smooth')
    applyValue(next)
  }, [applyValue, disabled, scrollToIndex])

  const publishOptions = useCallback(() => {
    if (optionsPublishScheduled.current) {
      return
    }
    optionsPublishScheduled.current = true
    queueMicrotask(() => {
      optionsPublishScheduled.current = false
      setOptions(orderedOptions(optionsRef.current))
    })
  }, [])

  const registerOption = useCallback((option: WheelPickerRegisteredOption<T>) => {
    optionsRef.current = optionsRef.current.filter((entry) => entry.id !== option.id)
    optionsRef.current.push(option)
    publishOptions()
    return () => {
      optionsRef.current = optionsRef.current.filter((entry) => entry.element !== option.element)
      publishOptions()
    }
  }, [publishOptions])

  useLayoutEffect(() => {
    syncToSelected('auto')
  }, [selected, syncToSelected])

  useLayoutEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) {
      return
    }
    let timer = 0
    let wheelRemainder = 0
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      if (disabled) {
        return
      }
      const options = orderedOptions(optionsRef.current)
      const itemHeight = itemHeightOf(options)
      if (!itemHeight || options.length === 0) {
        return
      }
      const pixelDelta = event.deltaMode === WheelEvent.DOM_DELTA_PIXEL
        ? event.deltaY
        : Math.sign(event.deltaY) * itemHeight
      const delta = Math.abs(pixelDelta) >= itemHeight
        ? Math.sign(pixelDelta) * itemHeight
        : pixelDelta
      wheelRemainder += delta
      const steps = Math.trunc(wheelRemainder / itemHeight)
      if (steps === 0) {
        return
      }
      wheelRemainder -= steps * itemHeight
      stepBy(steps)
    }
    const onScroll = () => {
      if (disabled) {
        return
      }
      userScrollingRef.current = true
      paintOptions(orderedOptions(optionsRef.current), scroller.scrollTop)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        userScrollingRef.current = false
        commitFromScroll()
      }, 80)
    }
    const onScrollEnd = () => {
      window.clearTimeout(timer)
      userScrollingRef.current = false
      commitFromScroll()
    }
    let touchStartY = 0
    let touchStartScroll = 0
    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0
      touchStartScroll = scroller.scrollTop
    }
    const onTouchEnd = (event: TouchEvent) => {
      if (!isLoopingRef.current) {
        return
      }
      const options = orderedOptions(optionsRef.current)
      const itemHeight = itemHeightOf(options)
      if (itemHeight <= 0 || options.length === 0) {
        return
      }
      const endY = event.changedTouches[0]?.clientY ?? touchStartY
      const dragged = touchStartY - endY
      const maxScroll = (options.length - 1) * itemHeight
      const startedAtEnd = touchStartScroll >= maxScroll - 1
      const startedAtStart = touchStartScroll <= 1
      if (startedAtEnd && dragged > itemHeight / 2) {
        stepBy(1)
      } else if (startedAtStart && dragged < -itemHeight / 2) {
        stepBy(-1)
      }
    }
    const root = scroller.parentElement ?? scroller
    root.addEventListener('wheel', onWheel, { passive: false })
    root.addEventListener('touchstart', onTouchStart, { passive: true })
    root.addEventListener('touchend', onTouchEnd)
    scroller.addEventListener('scroll', onScroll, { passive: true })
    scroller.addEventListener('scrollend', onScrollEnd)
    return () => {
      window.clearTimeout(timer)
      root.removeEventListener('wheel', onWheel)
      root.removeEventListener('touchstart', onTouchStart)
      root.removeEventListener('touchend', onTouchEnd)
      scroller.removeEventListener('scroll', onScroll)
      scroller.removeEventListener('scrollend', onScrollEnd)
    }
  }, [commitFromScroll, disabled, scrollToIndex, stepBy])

  const moveSelection = useCallback((direction: 1 | -1 | 'start' | 'end') => {
    const options = orderedOptions(optionsRef.current)
    if (options.length === 0) {
      return
    }
    const currentIndex = options.findIndex((option) => Object.is(option.value, selectedRef.current))
    let nextIndex = currentIndex < 0 ? (direction === -1 ? options.length : -1) : currentIndex
    if (direction === 'start') {
      nextIndex = 0
    } else if (direction === 'end') {
      nextIndex = options.length - 1
    } else {
      const { index, loops } = resolveStep(currentIndex < 0 ? 0 : currentIndex, direction, options.length, isLooping)
      nextIndex = index
      const option = options[nextIndex]
      if (!option) {
        return
      }
      scrollToIndex(nextIndex, 'smooth')
      applyValue(option.value)
      if (loops !== 0) {
        onLoop?.({
          value: option.value,
          direction,
          loopedAround: direction === 1 ? 'end' : 'start',
        })
      }
      return
    }
    const option = options[nextIndex]
    if (!option) {
      return
    }
    scrollToIndex(nextIndex, 'smooth')
    applyValue(option.value)
  }, [applyValue, isLooping, onLoop, scrollToIndex])

  const contextValue = useMemo(() => ({
    value: selected,
    disabled,
    listboxId,
    registerOption,
    selectValue,
  }), [disabled, listboxId, registerOption, selectValue, selected])

  const activeId = options.find((option) => Object.is(option.value, selected))?.id
  const rowSpan = Number.isFinite(visibleRows) ? Math.max(0, visibleRows) : 1
  const previewCount = isLooping ? Math.ceil(rowSpan) : 0
  const leadingPreview = previewCopies(wrappedNodes(items, items.length - previewCount, previewCount), 'leading')
  const trailingPreview = previewCopies(wrappedNodes(items, 0, previewCount), 'trailing')
  const pickerStyle = {
    ...style,
    '--wheel-picker-visible-span': rowSpan,
  } as CSSProperties

  return (
    <WheelPickerContextProvider value={contextValue}>
      <div
        {...props}
        id={listboxId}
        role="listbox"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        aria-orientation="vertical"
        aria-activedescendant={activeId}
        data-disabled={disabled ? '' : undefined}
        data-looping={isLooping ? '' : undefined}
        className={clsx('wheel-picker-root', className)}
        style={pickerStyle}
        onKeyDown={(event) => {
          onKeyDown?.(event)
          if (event.defaultPrevented || disabled) {
            return
          }
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            moveSelection(1)
          } else if (event.key === 'ArrowUp') {
            event.preventDefault()
            moveSelection(-1)
          } else if (event.key === 'Home') {
            event.preventDefault()
            moveSelection('start')
          } else if (event.key === 'End') {
            event.preventDefault()
            moveSelection('end')
          }
        }}
      >
        <div
          ref={scrollerRef}
          className="wheel-picker-items"
        >
          {isLooping && (
            <div className="wheel-picker-loop-preview" aria-hidden>
              <WheelPickerPreviewScope>
                {leadingPreview}
              </WheelPickerPreviewScope>
            </div>
          )}
          {items}
          {isLooping && (
            <div className="wheel-picker-loop-preview wheel-picker-loop-preview-end" aria-hidden>
              <WheelPickerPreviewScope>
                {trailingPreview}
              </WheelPickerPreviewScope>
            </div>
          )}
        </div>
        {bars}
      </div>
    </WheelPickerContextProvider>
  )
}
