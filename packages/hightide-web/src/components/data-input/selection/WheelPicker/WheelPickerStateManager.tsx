import { useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import type { DOMInputStateManagerProps } from '../../domInput'
import { useInputStateManager } from '@helpwave/hightide-utils/hooks'
import type { SelectionOptionInput } from '../option'
import { normalizeSelectionOptions } from '../option'
import {
  WheelPickerContext,
  type WheelPickerActions,
  type WheelPickerContextConfig,
  type WheelPickerContextValue
} from './WheelPickerContext'
import {
  wheelPickerStateTransition,
  type WheelPickerEvent,
  type WheelPickerLoopEvent,
  type WheelPickerState
} from './WheelPickerState'
import { itemHeightOf, paintOptions, resolveStep } from './wheelPickerMotion'

export type WheelPickerStateManagerProps<T> = DOMInputStateManagerProps<WheelPickerState<T>, WheelPickerEvent<T>>
  & {
    options: ReadonlyArray<SelectionOptionInput<T>>,
    isLooping?: boolean,
    visibleRows?: number,
    onLoop?: (event: WheelPickerLoopEvent<T>) => void,
  }

export function WheelPickerStateManager<T>({
  state,
  value,
  initialValue,
  onValueChange,
  onStateChange,
  onStateEvent,
  onLoop,
  options: optionsInput,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  id,
  isLooping = false,
  visibleRows = 1,
  children,
}: WheelPickerStateManagerProps<T>) {
  const handleStateEvent = useCallback((event: WheelPickerEvent<T>) => {
    onStateEvent?.(event)
    if (event.type === 'loop') {
      onLoop?.(event)
    }
  }, [onLoop, onStateEvent])

  const machine = useInputStateManager({
    state,
    value,
    initialValue,
    onValueChange,
    initialState: (seeded) => ({ value: seeded ?? null }),
    transition: wheelPickerStateTransition,
    onStateChange,
    onStateEvent: handleStateEvent,
  })

  const options = useMemo(() => normalizeSelectionOptions(optionsInput), [optionsInput])
  const optionElementsRef = useRef<Record<string, HTMLElement | null>>({})
  const itemsRef = useRef<HTMLDivElement>(null)
  const actionsRef = useRef<WheelPickerActions<T>>({
    stepBy: () => {},
    moveSelection: () => {},
    selectValue: () => {},
  })
  const optionsRef = useRef(options)
  const userScrollingRef = useRef(false)
  const programmaticScrollDepthRef = useRef(0)
  const dispatchRef = useRef(machine.dispatch)
  const isLoopingRef = useRef(isLooping)
  const isLocked = isDisabled || isReadOnly
  const isLockedRef = useRef(isLocked)
  const selectedRef = useRef(machine.state.value)
  optionsRef.current = options
  selectedRef.current = machine.state.value
  dispatchRef.current = machine.dispatch
  isLoopingRef.current = isLooping
  isLockedRef.current = isLocked

  const applyValue = useCallback((next: T, type: WheelPickerEvent<T>['type'] = 'change') => {
    if (type === 'change' && Object.is(selectedRef.current, next)) {
      return
    }
    selectedRef.current = next
    if (type === 'loop') {
      return
    }
    if (type === 'commit') {
      dispatchRef.current({ type: 'commit', value: next })
      return
    }
    dispatchRef.current({ type: 'change', value: next })
  }, [])

  const emitLoop = useCallback((next: T, direction: 1 | -1, loopedAround: 'start' | 'end') => {
    selectedRef.current = next
    dispatchRef.current({
      type: 'loop',
      value: next,
      direction,
      loopedAround,
    })
  }, [])

  const scrollToIndex = useCallback((index: number, behavior: ScrollBehavior) => {
    const scroller = itemsRef.current
    const currentOptions = optionsRef.current
    const elements = optionElementsRef.current
    const itemHeight = itemHeightOf(currentOptions, elements)
    if (!scroller || itemHeight <= 0) {
      return
    }
    const top = Math.max(0, Math.min(currentOptions.length - 1, index)) * itemHeight
    if (Math.abs(scroller.scrollTop - top) <= 1) {
      paintOptions(currentOptions, elements, scroller.scrollTop)
      return
    }
    if (behavior === 'auto') {
      programmaticScrollDepthRef.current += 1
      userScrollingRef.current = false
      scroller.scrollTo({ top, behavior })
      paintOptions(currentOptions, elements, top)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          programmaticScrollDepthRef.current = Math.max(0, programmaticScrollDepthRef.current - 1)
        })
      })
      return
    }
    userScrollingRef.current = true
    scroller.scrollTo({ top, behavior })
  }, [])

  const syncToSelected = useCallback((behavior: ScrollBehavior) => {
    if (userScrollingRef.current || isLockedRef.current) {
      return
    }
    const currentOptions = optionsRef.current
    if (currentOptions.length === 0) {
      return
    }
    const selectedValue = selectedRef.current
    const index = selectedValue === null
      ? 0
      : currentOptions.findIndex((option) => Object.is(option.value, selectedValue))
    scrollToIndex(index < 0 ? 0 : index, behavior)
  }, [scrollToIndex])

  const commitFromScroll = useCallback(() => {
    if (isLockedRef.current) {
      return
    }
    const scroller = itemsRef.current
    const currentOptions = optionsRef.current
    const elements = optionElementsRef.current
    const itemHeight = itemHeightOf(currentOptions, elements)
    if (!scroller || itemHeight <= 0 || currentOptions.length === 0) {
      return
    }
    const index = Math.round(scroller.scrollTop / itemHeight)
    const option = currentOptions[Math.max(0, Math.min(currentOptions.length - 1, index))]
    if (!option) {
      return
    }
    paintOptions(currentOptions, elements, scroller.scrollTop)
    applyValue(option.value, 'commit')
  }, [applyValue])

  const stepBy = useCallback((steps: number) => {
    const scroller = itemsRef.current
    const currentOptions = optionsRef.current
    const elements = optionElementsRef.current
    const itemHeight = itemHeightOf(currentOptions, elements)
    if (!scroller || itemHeight <= 0 || currentOptions.length === 0 || steps === 0) {
      return
    }
    const currentIndex = Math.round(scroller.scrollTop / itemHeight)
    const { index, loops } = resolveStep(currentIndex, steps, currentOptions.length, isLoopingRef.current)
    const option = currentOptions[index]
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
      emitLoop(option.value, direction, loopedAround)
    }
  }, [applyValue, emitLoop, scrollToIndex])

  const selectValue = useCallback((next: T) => {
    if (isLockedRef.current) {
      return
    }
    const currentOptions = optionsRef.current
    const index = currentOptions.findIndex((option) => Object.is(option.value, next))
    if (index < 0) {
      return
    }
    const currentIndex = currentOptions.findIndex((option) => Object.is(option.value, selectedRef.current))
    if (isLoopingRef.current && currentIndex >= 0 && currentOptions.length > 1) {
      const forward = (index - currentIndex + currentOptions.length) % currentOptions.length
      const steps = forward <= currentOptions.length / 2 ? forward : forward - currentOptions.length
      if (steps !== 0 && (currentIndex + steps < 0 || currentIndex + steps >= currentOptions.length)) {
        stepBy(steps)
        return
      }
    }
    scrollToIndex(index, 'smooth')
    applyValue(next)
  }, [applyValue, scrollToIndex, stepBy])

  const moveSelection = useCallback((direction: 'start' | 'end') => {
    const currentOptions = optionsRef.current
    if (currentOptions.length === 0) {
      return
    }
    const nextIndex = direction === 'start' ? 0 : currentOptions.length - 1
    const option = currentOptions[nextIndex]
    if (!option) {
      return
    }
    scrollToIndex(nextIndex, 'smooth')
    applyValue(option.value)
  }, [applyValue, scrollToIndex])

  actionsRef.current = {
    stepBy,
    moveSelection,
    selectValue,
  }

  const optionsIdentity = options.map((option) => option.id).join('\u0000')

  useLayoutEffect(() => {
    syncToSelected('auto')
  }, [machine.state.value, optionsIdentity, syncToSelected])

  useLayoutEffect(() => {
    const scroller = itemsRef.current
    if (!scroller) {
      return
    }
    let timer = 0
    let wheelRemainder = 0
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      if (isLockedRef.current) {
        return
      }
      const currentOptions = optionsRef.current
      const itemHeight = itemHeightOf(currentOptions, optionElementsRef.current)
      if (!itemHeight || currentOptions.length === 0) {
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
      if (programmaticScrollDepthRef.current > 0) {
        paintOptions(optionsRef.current, optionElementsRef.current, scroller.scrollTop)
        return
      }
      if (isLockedRef.current) {
        return
      }
      userScrollingRef.current = true
      paintOptions(optionsRef.current, optionElementsRef.current, scroller.scrollTop)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        userScrollingRef.current = false
        commitFromScroll()
      }, 80)
    }
    const onScrollEnd = () => {
      if (programmaticScrollDepthRef.current > 0) {
        return
      }
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
      const currentOptions = optionsRef.current
      const itemHeight = itemHeightOf(currentOptions, optionElementsRef.current)
      if (itemHeight <= 0 || currentOptions.length === 0) {
        return
      }
      const endY = event.changedTouches[0]?.clientY ?? touchStartY
      const dragged = touchStartY - endY
      const maxScroll = (currentOptions.length - 1) * itemHeight
      const startedAtEnd = touchStartScroll >= maxScroll - 1
      const startedAtStart = touchStartScroll <= 1
      if (startedAtEnd && dragged > itemHeight / 2) {
        stepBy(1)
      } else if (startedAtStart && dragged < -itemHeight / 2) {
        stepBy(-1)
      }
    }
    const layout = scroller.parentElement ?? scroller
    layout.addEventListener('wheel', onWheel, { passive: false })
    layout.addEventListener('touchstart', onTouchStart, { passive: true })
    layout.addEventListener('touchend', onTouchEnd)
    scroller.addEventListener('scroll', onScroll, { passive: true })
    scroller.addEventListener('scrollend', onScrollEnd)
    return () => {
      window.clearTimeout(timer)
      layout.removeEventListener('wheel', onWheel)
      layout.removeEventListener('touchstart', onTouchStart)
      layout.removeEventListener('touchend', onTouchEnd)
      scroller.removeEventListener('scroll', onScroll)
      scroller.removeEventListener('scrollend', onScrollEnd)
    }
  }, [commitFromScroll, stepBy])

  const config = useMemo<WheelPickerContextConfig>(() => ({
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
    id,
    isLooping,
    visibleRows,
  }), [id, isDisabled, isInvalid, isLooping, isReadOnly, isRequired, visibleRows])

  const contextValue = useMemo<WheelPickerContextValue<T>>(() => ({
    state: machine.state,
    dispatch: machine.dispatch,
    config,
    options,
    optionElementsRef,
    itemsRef,
    isPreview: false,
    actionsRef,
  }), [config, machine.dispatch, machine.state, options])

  return (
    <WheelPickerContext.Provider value={contextValue as WheelPickerContextValue<unknown>}>
      {children}
    </WheelPickerContext.Provider>
  )
}
