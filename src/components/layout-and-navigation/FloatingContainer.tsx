import type { HTMLAttributes, MutableRefObject, ReactNode } from 'react'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useIsMounted } from '@/src/hooks/focus/useIsMounted'
import { match } from '@/src/utils/match'
import { clamp } from '@/src/utils/math'
import { clsx } from 'clsx'
import { FocusTrap } from '@/src/components/utils/FocusTrap'

type Position = {
  left: number,
  top: number,
  maxWidth: number,
  maxHeight: number,
}

type Alignment = 'beforeStart' | 'afterStart' | 'center' | 'beforeEnd' | 'afterEnd'

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
  isFocusTrap?: boolean,
  isFocusingFirst?: boolean,
}

export const FloatingContainer = forwardRef<HTMLDivElement, FloatingContainerProps>(function FloatingContainer({
                                                                                                                 children,
                                                                                                                 backgroundOverlay,
                                                                                                                 anchor,
                                                                                                                 reactToAnchorScrolling = false,
                                                                                                                 verticalAlignment,
                                                                                                                 horizontalAlignment,
                                                                                                                 screenPadding = 16,
                                                                                                                 gap = 4,
                                                                                                                 isFocusTrap = false,
                                                                                                                 isFocusingFirst = false,
                                                                                                                 ...props
                                                                                                               }, forwardRef) {
  const innerRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(forwardRef, () => innerRef.current)

  const isMounted = useIsMounted()
  const [position, setPosition] = useState<Position>()

  const pollingRate = 100

  useEffect(() => {
    const calculatePosition = () => {
      const windowHeight = window.innerHeight
      const windowWidth = window.innerWidth
      const anchorElement = anchor?.current
      const anchorBoundingRect = anchorElement?.getBoundingClientRect() ?? {
        top: 0,
        bottom: windowHeight,
        left: 0,
        right: windowWidth,
        width: windowWidth,
        height: windowHeight,
      }
      const maxWidth = windowWidth - 2 * screenPadding
      const maxHeight = windowHeight - 2 * screenPadding

      const containerBoundingRect = innerRef.current.getBoundingClientRect()
      const width = Math.min(containerBoundingRect.width, maxWidth)
      const height = Math.min(containerBoundingRect.height, maxHeight)

      const leftSuggestion = match(horizontalAlignment, {
        beforeStart: anchorBoundingRect.left - width - gap,
        afterStart: anchorBoundingRect.left,
        center: anchorBoundingRect.left + anchorBoundingRect.width / 2 - width / 2,
        beforeEnd: anchorBoundingRect.right - width,
        afterEnd: anchorBoundingRect.right + gap,
      })
      const left = clamp(leftSuggestion, [screenPadding, windowWidth - screenPadding - width])

      const topSuggestion = match(verticalAlignment, {
        beforeStart: anchorBoundingRect.top - height - gap,
        afterStart: anchorBoundingRect.top,
        center: anchorBoundingRect.top + anchorBoundingRect.height / 2 - height / 2,
        beforeEnd: anchorBoundingRect.bottom - height,
        afterEnd: anchorBoundingRect.bottom + gap,
      })
      const top = clamp(topSuggestion, [screenPadding, windowHeight - screenPadding - height])

      setPosition({
        left,
        top,
        maxWidth,
        maxHeight
      })
    }

    calculatePosition()

    window.addEventListener('resize', calculatePosition)
    let timeout: NodeJS.Timeout
    if (reactToAnchorScrolling) {
      timeout = setInterval(calculatePosition, pollingRate)
    }
    return () => {
      if (timeout) {
        clearInterval(timeout)
      }
      window.removeEventListener('resize', calculatePosition)
    }
  }, [isMounted, anchor, horizontalAlignment, verticalAlignment, screenPadding, gap, reactToAnchorScrolling])

  return createPortal(
    <>
      {backgroundOverlay}
      <FocusTrap
        active={isFocusTrap}
        {...props}
        ref={innerRef}
        style={{
          position: 'fixed',
          overflow: 'hidden',
          opacity: position ? undefined : 0, // hide when position calculation isn't done yet
          transition: `top ${pollingRate}ms linear, left ${pollingRate}ms linear`,
          ...position,
          ...props.style
        }}
        className={clsx('motion-safe:duration-100 motion-reduce:duration-0', props.className)}
        focusFirst={isFocusingFirst}
      >
        {children}
      </FocusTrap>
    </>,
    document.body
  )
})