import type { HTMLAttributes, MutableRefObject, ReactNode } from 'react'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import { createPortal } from 'react-dom'
import { clsx } from 'clsx'
import type { UseFloatingElementOptions } from '@/src/hooks/useFloatingElement'
import { useFloatingElement } from '@/src/hooks/useFloatingElement'

export type FloatingContainerProps = HTMLAttributes<HTMLDivElement> & UseFloatingElementOptions & {
  anchor?: MutableRefObject<HTMLElement>,
  /**
   * Polls the position of the anchor every 100ms
   *
   * Use sparingly
   */
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
                                                                                                                 isPolling = false,
                                                                                                                 pollingInterval = 100,
                                                                                                                 verticalAlignment = 'afterEnd',
                                                                                                                 horizontalAlignment = 'afterStart',
                                                                                                                 screenPadding = 16,
                                                                                                                 gap = 4,
                                                                                                                 ...props
                                                                                                               }, forwardRef) {
  const innerRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(forwardRef, () => innerRef.current)

  const position = useFloatingElement({
    active: !props.hidden,
    containerRef: innerRef,
    anchorRef: anchor,
    isPolling,
    pollingInterval,
    verticalAlignment,
    horizontalAlignment,
    gap,
    screenPadding,
  })

  return createPortal(
    <>
      {backgroundOverlay}
      <div
        {...props}
        ref={innerRef}
        style={{
          position: 'fixed',
          overflow: 'hidden',
          opacity: position ? undefined : 0, // hide when position calculation isn't done yet
          transition: position ? `top ${pollingInterval}ms linear, left ${pollingInterval}ms linear` : undefined,
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