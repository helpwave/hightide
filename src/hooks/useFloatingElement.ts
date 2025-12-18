'use client'

import type { CSSProperties, RefObject } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { clamp } from '@/src/utils/math'
import { useIsMounted } from '@/src/hooks/focus/useIsMounted'

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
}

type CalculatePositionProps = {
  windowRect: RectangleBounds,
  containerRect: RectangleBounds,
  anchorRect: RectangleBounds,
  options: CalculatePositionOptions,
}

type UseFloatingElementStyle = {
  left: number,
  top: number,
  maxWidth: number,
  maxHeight: number,
}

function calculatePosition({
                             windowRect,
                             containerRect,
                             anchorRect,
                             options,
                           }: CalculatePositionProps): UseFloatingElementStyle {
  const { verticalAlignment, horizontalAlignment, gap, screenPadding } = options
  const windowWidth = windowRect.width
  const windowHeight = windowRect.height

  const maxWidth = windowWidth - 2 * screenPadding
  const maxHeight = windowHeight - 2 * screenPadding

  const width = Math.min(containerRect.width, maxWidth)
  const height = Math.min(containerRect.height, maxHeight)

  const leftSuggestion = {
    beforeStart: anchorRect.left - width - gap,
    afterStart: anchorRect.left,
    center: anchorRect.left + anchorRect.width / 2 - width / 2,
    beforeEnd: anchorRect.right - width,
    afterEnd: anchorRect.right + gap,
  }[horizontalAlignment]

  const topSuggestion = {
    beforeStart: anchorRect.top - height - gap,
    afterStart: anchorRect.top,
    center: anchorRect.top + anchorRect.height / 2 - height / 2,
    beforeEnd: anchorRect.bottom - height,
    afterEnd: anchorRect.bottom + gap,
  }[verticalAlignment]

  const left = clamp(leftSuggestion, [
    screenPadding,
    windowWidth - screenPadding - width,
  ])

  const top = clamp(topSuggestion, [
    screenPadding,
    windowHeight - screenPadding - height,
  ])

  return {
    left,
    top,
    maxWidth,
    maxHeight,
  }
}

export type UseFloatingElementOptions = CalculatePositionOptions & {
  isPolling?: boolean,
  pollingInterval?: number,
}

export type UseFloatingElementProps = UseFloatingElementOptions & {
  containerRef: RefObject<HTMLElement>,
  anchorRef: RefObject<HTMLElement>,
  windowRef?: RefObject<HTMLElement>,
  active?: boolean,
}

export function useFloatingElement({
                                     active = true,
                                     windowRef,
                                     anchorRef,
                                     containerRef,
                                     isPolling = false,
                                     pollingInterval = 100,
                                     verticalAlignment = 'afterEnd',
                                     horizontalAlignment = 'afterStart',
                                     screenPadding = 16,
                                     gap = 4,
                                   }: UseFloatingElementProps) {
  const [style, setStyle] = useState<CSSProperties>()
  const isMounted = useIsMounted()

  const calculate = useCallback(() => {
    const containerRect = containerRef.current?.getBoundingClientRect()
    if(!containerRect) {
      return
    }
    const windowRect: RectangleBounds = windowRef?.current?.getBoundingClientRect() ?? {
      top: 0,
      bottom: window.innerHeight,
      left: 0,
      right: window.innerWidth,
      width: window.innerWidth,
      height: window.innerHeight,
    }
    const anchorElement = anchorRef?.current
    if (anchorRef && !anchorElement) {
      console.warn('FloatingContainer anchor provided, but its value is undefined')
    }
    const anchorRect: RectangleBounds = anchorElement?.getBoundingClientRect() ?? windowRect

    const calculateProps: CalculatePositionProps = {
      windowRect,
      anchorRect,
      containerRect,
      options: {
        horizontalAlignment,
        verticalAlignment,
        screenPadding,
        gap,
      }
    }
    setStyle(calculatePosition(calculateProps))
  }, [anchorRef, containerRef, gap, horizontalAlignment, screenPadding, verticalAlignment, windowRef])


  const height = containerRef.current?.getBoundingClientRect().height
  const width = containerRef.current?.getBoundingClientRect().width
  useEffect(() => {
    if (active && isMounted) {
      calculate()
    } else {
      setStyle(undefined)
    }
  }, [calculate, active, isMounted, height, width])

  useEffect(() => {
    if(!containerRef.current && active) {
      return
    }
    window.addEventListener('resize', calculate)
    let timeout: NodeJS.Timeout
    if (isPolling) {
      timeout = setInterval(calculate, pollingInterval)
    }
    return () => {
      window.removeEventListener('resize', calculate)
      if (timeout) {
        clearInterval(timeout)
      }
    }
  }, [active, calculate, containerRef, isPolling, pollingInterval])

  return style
}