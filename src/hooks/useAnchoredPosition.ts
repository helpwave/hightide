'use client'

import type { CSSProperties, RefObject } from 'react'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { MathUtil } from '@/src/utils/math'
import { useWindowResizeObserver } from './useResizeCallbackWrapper'
import { useResizeObserver } from './useResizeObserver'
import { useScrollObserver } from './useScrollObserver'

export type FloatingElementAlignment = 'beforeStart' | 'afterStart' | 'center' | 'beforeEnd' | 'afterEnd'

type RectangleBounds = {
  top: number,
  right: number,
  bottom: number,
  left: number,
  width: number,
  height: number,
}

type CalculatePositionOptions = {
  verticalAlignment?: FloatingElementAlignment,
  horizontalAlignment?: FloatingElementAlignment,
  screenPadding?: number,
  gap?: number,
  avoidOverlap?: boolean,
}

type CalculatePositionProps = {
  windowRect: RectangleBounds,
  containerRect: RectangleBounds,
  anchorRect: RectangleBounds,
  options: CalculatePositionOptions,
}


function calculatePosition({
  windowRect,
  containerRect,
  anchorRect,
  options,
}: CalculatePositionProps): CSSProperties {
  const { verticalAlignment, horizontalAlignment, gap, screenPadding, avoidOverlap } = options

  const calculateBasicPosition = (hAlign: FloatingElementAlignment, vAlign: FloatingElementAlignment) => {
    const windowWidth = windowRect.width
    const windowHeight = windowRect.height

    const maxWidth = windowWidth - 2 * screenPadding
    const maxHeight = windowHeight - 2 * screenPadding

    const width = Math.min(containerRect.width, maxWidth)
    const height = Math.min(containerRect.height, maxHeight)

    const anchorCenterX = anchorRect.left + anchorRect.width / 2
    const anchorCenterY = anchorRect.top + anchorRect.height / 2

    let left: number
    let top: number
    let translateXPercent: number
    let translateYPercent: number

    switch (hAlign) {
    case 'beforeStart':
      left = anchorRect.left
      translateXPercent = -100
      break
    case 'afterStart':
      left = anchorRect.left
      translateXPercent = 0
      break
    case 'center':
      left = anchorCenterX
      translateXPercent = -50
      break
    case 'beforeEnd':
      left = anchorRect.right
      translateXPercent = -100
      break
    case 'afterEnd':
      left = anchorRect.right
      translateXPercent = 0
      break
    }

    switch (vAlign) {
    case 'beforeStart':
      top = anchorRect.top
      translateYPercent = -100
      break
    case 'afterStart':
      top = anchorRect.top
      translateYPercent = 0
      break
    case 'center':
      top = anchorCenterY
      translateYPercent = -50
      break
    case 'beforeEnd':
      top = anchorRect.bottom
      translateYPercent = -100
      break
    case 'afterEnd':
      top = anchorRect.bottom
      translateYPercent = 0
      break
    }

    if (gap !== 0) {
      if (hAlign === 'afterEnd') {
        left += gap
      } else if (hAlign === 'beforeStart') {
        left -= gap
      }

      if (vAlign === 'afterEnd') {
        top += gap
      } else if (vAlign === 'beforeStart') {
        top -= gap
      }
    }

    const targetLeft = left + (width * translateXPercent / 100)
    const targetTop = top + (height * translateYPercent / 100)

    const clampedLeft = MathUtil.clamp(targetLeft, [screenPadding, windowWidth - screenPadding - width])
    const clampedTop = MathUtil.clamp(targetTop, [screenPadding, windowHeight - screenPadding - height])

    return {
      left,
      top,
      clampedLeft,
      clampedTop,
      width,
      height,
      maxWidth,
      maxHeight,
    }
  }

  // Calculate overlap area between two rectangles
  const calculateOverlap = (left: number, top: number, width: number, height: number): number => {
    const floatingRect = {
      left,
      top,
      right: left + width,
      bottom: top + height,
    }

    // Calculate overlap area
    const overlapLeft = Math.max(floatingRect.left, anchorRect.left)
    const overlapTop = Math.max(floatingRect.top, anchorRect.top)
    const overlapRight = Math.min(floatingRect.right, anchorRect.right)
    const overlapBottom = Math.min(floatingRect.bottom, anchorRect.bottom)

    const overlapWidth = Math.max(0, overlapRight - overlapLeft)
    const overlapHeight = Math.max(0, overlapBottom - overlapTop)

    return overlapWidth * overlapHeight
  }

  // Get original position
  const originalPos = calculateBasicPosition(horizontalAlignment, verticalAlignment)
  let bestPosition = originalPos

  // If avoidOverlap is enabled and we have beforeStart/afterEnd alignments, try swapped alignments
  if (avoidOverlap && (horizontalAlignment === 'beforeStart' || horizontalAlignment === 'afterEnd' || verticalAlignment === 'beforeStart' || verticalAlignment === 'afterEnd')) {
    let bestOverlap = calculateOverlap(originalPos.clampedLeft, originalPos.clampedTop, originalPos.width, originalPos.height)

    // Create swapped alignments
    let altHorizontalAlignment = horizontalAlignment
    let altVerticalAlignment = verticalAlignment

    if (horizontalAlignment === 'beforeStart') {
      altHorizontalAlignment = 'afterEnd'
    } else if (horizontalAlignment === 'afterEnd') {
      altHorizontalAlignment = 'beforeStart'
    }

    if (verticalAlignment === 'beforeStart') {
      altVerticalAlignment = 'afterEnd'
    } else if (verticalAlignment === 'afterEnd') {
      altVerticalAlignment = 'beforeStart'
    }

    // Calculate alternative position
    const altPos = calculateBasicPosition(altHorizontalAlignment, altVerticalAlignment)
    const altOverlap = calculateOverlap(altPos.clampedLeft, altPos.clampedTop, altPos.width, altPos.height)

    // Use alternative if it has less overlap
    if (altOverlap < bestOverlap) {
      bestPosition = altPos
      bestOverlap = altOverlap
    }
  }

  const adjustedTranslateX = (bestPosition.clampedLeft - bestPosition.left) / bestPosition.width * 100
  const adjustedTranslateY = (bestPosition.clampedTop - bestPosition.top) / bestPosition.height * 100

  return {
    left: bestPosition.left,
    top: bestPosition.top,
    maxWidth: bestPosition.maxWidth,
    maxHeight: bestPosition.maxHeight,
    transform: `translate(${adjustedTranslateX}%, ${adjustedTranslateY}%)`,
    transformOrigin: 'top left',
  }
}

export type UseAnchoredPositionOptions = CalculatePositionOptions & {
  isPolling?: boolean,
  isReactingToResize?: boolean,
  isReactingToScroll?: boolean,
  pollingInterval?: number,
}

export type UseAnchoredPostitionProps = UseAnchoredPositionOptions & {
  container: RefObject<HTMLElement>,
  anchor: RefObject<HTMLElement>,
  window?: RefObject<HTMLElement>,
  active?: boolean,
}

const measureSizes = ({
  containerRef,
  anchorRef,
  windowRef,
}: {
    containerRef?: RefObject<HTMLElement>,
    anchorRef?: RefObject<HTMLElement>,
    windowRef?: RefObject<HTMLElement>,
  }) => {
  return {
    container: containerRef?.current?.getBoundingClientRect(),
    anchor: anchorRef?.current?.getBoundingClientRect(),
    window: windowRef?.current?.getBoundingClientRect() ?? {
      top: 0,
      bottom: window.innerHeight,
      left: 0,
      right: window.innerWidth,
      width: window.innerWidth,
      height: window.innerHeight,
    },
  }
}

type MeasureSize = ReturnType<typeof measureSizes>

// dont check position of container because we are changing it
const isSameMeasurment = (a: MeasureSize, b: MeasureSize) =>
  a &&
  b &&
  a.container?.width === b.container?.width &&
  a.container?.height === b.container?.height &&
  a.anchor?.top === b.anchor?.top &&
  a.anchor?.left === b.anchor?.left &&
  a.anchor?.right === b.anchor?.right &&
  a.anchor?.bottom === b.anchor?.bottom &&
  a.anchor?.width === b.anchor?.width &&
  a.anchor?.height === b.anchor?.height &&
  a.window?.top === b.window?.top &&
  a.window?.left === b.window?.left &&
  a.window?.right === b.window?.right &&
  a.window?.bottom === b.window?.bottom &&
  a.window?.width === b.window?.width &&
  a.window?.height === b.window?.height

const isSameOptions = (a: CalculatePositionOptions, b: CalculatePositionOptions) =>
  a.horizontalAlignment === b.horizontalAlignment &&
  a.verticalAlignment === b.verticalAlignment &&
  a.screenPadding === b.screenPadding &&
  a.gap === b.gap &&
  a.avoidOverlap === b.avoidOverlap

export function useAnchoredPosition({
  active = true,
  window: windowRef,
  anchor: anchorRef,
  container: containerRef,
  isPolling = false,
  isReactingToResize = true,
  isReactingToScroll = false,
  pollingInterval = 100,
  verticalAlignment = 'afterEnd',
  horizontalAlignment = 'afterStart',
  avoidOverlap = false,
  screenPadding = 16,
  gap = 4,
}: UseAnchoredPostitionProps) {
  const [style, setStyle] = useState<CSSProperties>()
  const lastSizes = useRef<MeasureSize | null>(null)
  const lastOptions = useRef<CalculatePositionOptions | null>(null)

  const options = useMemo(() => ({
    horizontalAlignment,
    verticalAlignment,
    screenPadding,
    gap,
    avoidOverlap,
  }), [horizontalAlignment, verticalAlignment, screenPadding, gap, avoidOverlap])

  const calculate = useCallback(() => {
    const newMeasurement = measureSizes({ containerRef, anchorRef, windowRef })
    if (!newMeasurement) return
    if(isSameMeasurment(lastSizes.current, newMeasurement) && isSameOptions(options, lastOptions.current)) return
    lastSizes.current = newMeasurement
    lastOptions.current = options

    if(!newMeasurement.container) {
      return
    }
    const containerRect: RectangleBounds = newMeasurement.container
    const windowRect: RectangleBounds = newMeasurement.window
    const anchorRect: RectangleBounds = newMeasurement.anchor ?? newMeasurement.window

    if(containerRect.width === 0 || containerRect.height === 0) {
      return
    }

    const calculateProps: CalculatePositionProps = {
      windowRect,
      anchorRect,
      containerRect,
      options,
    }
    setStyle(calculatePosition(calculateProps))
  }, [anchorRef, containerRef, options, windowRef])

  useLayoutEffect(() => {
    if (!active) {
      setStyle(undefined)
      lastSizes.current = null
      return
    } else {
      calculate()
    }
  }, [active, options, calculate])

  useWindowResizeObserver(calculate)

  useResizeObserver({ observedElementRef: containerRef, onResize: calculate, isActive: isReactingToResize && active })
  useResizeObserver({ observedElementRef: anchorRef, onResize: calculate, isActive: isReactingToResize && active })
  useResizeObserver({ observedElementRef: windowRef, onResize: calculate, isActive: isReactingToResize && active })

  useScrollObserver({ observedElementRef: anchorRef, onScroll: calculate, isActive: isReactingToScroll && active })

  useEffect(() => {
    if(!containerRef.current || !active) {
      return
    }
    let timeout: NodeJS.Timeout
    if (isPolling) {
      timeout = setInterval(calculate, pollingInterval)
    }
    return () => {
      if (timeout) {
        clearInterval(timeout)
      }
    }
  }, [active, calculate, containerRef, isPolling, pollingInterval])
  return style
}