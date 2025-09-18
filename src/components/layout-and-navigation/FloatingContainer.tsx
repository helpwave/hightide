import type { HTMLAttributes, MutableRefObject, ReactNode } from 'react'
import { useCallback } from 'react'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useIsMounted } from '@/src/hooks/focus/useIsMounted'
import { clamp } from '@/src/utils/math'
import { clsx } from 'clsx'

type Alignment = 'beforeStart' | 'afterStart' | 'center' | 'beforeEnd' | 'afterEnd'

type RectangleBounds = {
  top: number,
  right: number,
  bottom: number,
  left: number,
  width: number,
  height: number,
}

type CalculatePositionOptions = {
  verticalAlignment?: Alignment,
  horizontalAlignment?: Alignment,
  screenPadding?: number,
  gap?: number,
}

type CalculatePositionProps = {
  windowRect: RectangleBounds,
  containerRect: RectangleBounds,
  anchorRect: RectangleBounds,
  options: CalculatePositionOptions,
}

type CalculatePositionResult = {
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
                           }: CalculatePositionProps): CalculatePositionResult {
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

export type FloatingContainerProps = HTMLAttributes<HTMLDivElement> & {
  anchor?: MutableRefObject<HTMLElement>,
  /**
   * Polls the position of the anchor every 100ms
   *
   * Use sparingly
   */
  reactToAnchorScrolling?: boolean,
  verticalAlignment?: Alignment,
  horizontalAlignment?: Alignment,
  screenPadding?: number,
  gap?: number,
  backgroundOverlay?: ReactNode,
}

/**
 * A floating container that aligns to its anchor
 *
 * Notes:
 * - to hide it use the hidden attribute as other means break the functionality
 */
export const FloatingContainer = forwardRef<HTMLDivElement, FloatingContainerProps>(function FloatingContainer({
                                                                                                                 children,
                                                                                                                 backgroundOverlay,
                                                                                                                 anchor,
                                                                                                                 reactToAnchorScrolling = false,
                                                                                                                 verticalAlignment = 'afterEnd',
                                                                                                                 horizontalAlignment = 'afterStart',
                                                                                                                 screenPadding = 16,
                                                                                                                 gap = 4,
                                                                                                                 ...props
                                                                                                               }, forwardRef) {
  const innerRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(forwardRef, () => innerRef.current)

  const isMounted = useIsMounted()
  const [position, setPosition] = useState<CalculatePositionResult>()

  const pollingRate = 100

  const calculate = useCallback(() => {
      const containerRect = innerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const windowWidth = window.innerWidth
      const windowRect: RectangleBounds = {
        top: 0,
        bottom: windowHeight,
        left: 0,
        right: windowWidth,
        width: windowWidth,
        height: windowHeight,
      }
      const anchorElement = anchor?.current
      if (anchor && !anchorElement) {
        console.warn('FloatingContainer anchor provided, but its value is undefined')
      }
      const anchorRect: RectangleBounds = anchorElement?.getBoundingClientRect() ?? windowRect

      const calculateProps: CalculatePositionProps = {
        windowRect,
        anchorRect,
        containerRect,
        options: {
          gap,
          screenPadding,
          horizontalAlignment,
          verticalAlignment
        }
      }
      setPosition(calculatePosition(calculateProps))
    }, [anchor, gap, horizontalAlignment, screenPadding, verticalAlignment])

  useEffect(() => {
    if (!isMounted && props.hidden) {
      return
    }
    calculate()
  }, [calculate, isMounted, props.hidden])

  useEffect(() => {
    window.addEventListener('resize', calculate)
    let timeout: NodeJS.Timeout
    if (reactToAnchorScrolling) {
      timeout = setInterval(calculate, pollingRate)
    }
    return () => {
      window.removeEventListener('resize', calculate)
      if (timeout) {
        clearInterval(timeout)
      }
    }
  }, [calculate, reactToAnchorScrolling])

  return createPortal(
    <>
      {backgroundOverlay}
      <div
        {...props}
        ref={innerRef}
        style={{
          position: 'absolute',
          overflow: 'hidden',
          opacity: position ? undefined : 0, // hide when position calculation isn't done yet
          transition: !props.hidden ? `top ${pollingRate}ms linear, left ${pollingRate}ms linear` : undefined,
          ...position,
          ...props.style
        }}
        className={clsx('motion-safe:duration-100 motion-reduce:duration-0', props.className)}
      >
        {children}
      </div>
    </>,
    document.body
  )
})