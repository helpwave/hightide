'use client'

import type { CSSProperties, RefObject } from 'react'
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { MathUtil } from '@/src/utils/math'
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


function calculatePosition({
  windowRect,
  containerRect,
  anchorRect,
  options,
}: CalculatePositionProps): CSSProperties {
  const { verticalAlignment, horizontalAlignment, gap, screenPadding } = options
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

  switch (horizontalAlignment) {
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

  switch (verticalAlignment) {
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
    if (horizontalAlignment === 'afterEnd') {
      left += gap
    } else if (horizontalAlignment === 'beforeStart') {
      left -= gap
    }

    if (verticalAlignment === 'afterEnd') {
      top += gap
    } else if (verticalAlignment === 'beforeStart') {
      top -= gap
    }
  }

  const targetLeft = left + (width * translateXPercent / 100)
  const targetTop = top + (height * translateYPercent / 100)

  const clampedLeft = MathUtil.clamp(targetLeft, [screenPadding, windowWidth - screenPadding - width])

  const clampedTop = MathUtil.clamp(targetTop, [screenPadding, windowHeight - screenPadding - height])

  const adjustedTranslateX = (clampedLeft - left) / width * 100
  const adjustedTranslateY = (clampedTop - top) / height * 100

  return {
    left,
    top,
    maxWidth,
    maxHeight,
    transform: `translate(${adjustedTranslateX}%, ${adjustedTranslateY}%)`,
    transformOrigin: 'top left',
  }
}

export type UseAnchoredPositionOptions = CalculatePositionOptions & {
  isPolling?: boolean,
  pollingInterval?: number,
}

export type UseAnchoredPostitionProps = UseAnchoredPositionOptions & {
  container: RefObject<HTMLElement>,
  anchor: RefObject<HTMLElement>,
  window?: RefObject<HTMLElement>,
  active?: boolean,
}

export function useAnchoredPosition({
  active = true,
  window: windowRef,
  anchor: anchorRef,
  container: containerRef,
  isPolling = false,
  pollingInterval = 100,
  verticalAlignment = 'afterEnd',
  horizontalAlignment = 'afterStart',
  screenPadding = 16,
  gap = 4,
}: UseAnchoredPostitionProps) {
  const [style, setStyle] = useState<CSSProperties>()
  const isMounted = useIsMounted()

  const options = useMemo(() => ({
    horizontalAlignment,
    verticalAlignment,
    screenPadding,
    gap,
  }), [horizontalAlignment, verticalAlignment, screenPadding, gap])

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
      console.warn('useAnchoredPosition Anchor provided, but its value is undefined')
    }
    const anchorRect: RectangleBounds = anchorElement?.getBoundingClientRect() ?? windowRect

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

  useEffect(() => {
    if (active && isMounted) {
      calculate()
    } else {
      setStyle(undefined)
    }
  }, [calculate, active, isMounted])

  useLayoutEffect(() => {
    if (!containerRef.current || !active) return

    const observer = new ResizeObserver(() => {
      calculate()
    })

    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [active, calculate, containerRef])

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