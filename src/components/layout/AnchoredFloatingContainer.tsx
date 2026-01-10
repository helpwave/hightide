import type { HTMLAttributes, RefObject } from 'react'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import { clsx } from 'clsx'
import type { UseAnchoredPositionOptions } from '@/src/hooks/useAnchoredPosition'
import { useAnchoredPosition as useAnchoredPosition } from '@/src/hooks/useAnchoredPosition'
import { Portal } from '../utils/Portal'
import { useOverlayRegistry } from '@/src/hooks/useOverlayRegistry'

export type BackgroundOverlayProps = HTMLAttributes<HTMLDivElement>

export interface AnchoredFloatingContainerProps extends HTMLAttributes<HTMLDivElement> {
  anchor?: RefObject<HTMLElement>,
  options?: UseAnchoredPositionOptions,
  hasBackgroundOverlay?: boolean,
  backgroundOverlayProps?: BackgroundOverlayProps,
  onBackgroundOverlayClick?: () => void,
}

export const AnchoredFloatingContainer = forwardRef<HTMLDivElement, AnchoredFloatingContainerProps>(function FloatingContainer({
  children,
  hasBackgroundOverlay = false,
  backgroundOverlayProps = {},
  onBackgroundOverlayClick,
  anchor,
  options = {},
  ...props
}, forwardRef) {
  const innerRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(forwardRef, () => innerRef.current)

  const position = useAnchoredPosition({
    ...options,
    containerRef: innerRef,
    anchorRef: anchor,
  })

  const { zIndex } = useOverlayRegistry()

  const container = (
    <div
      {...props}
      ref={innerRef}

      data-positioned={position ? '' : undefined}

      style={{
        position: 'fixed',
        zIndex: !hasBackgroundOverlay ? zIndex : undefined,
        overflow: 'hidden',
        opacity: position ? undefined : 0, // hide when position calculation isn't done yet
        transition: (position ? `top ${options.pollingInterval ?? 100}ms linear, left ${options.pollingInterval ?? 100}ms linear` : undefined),
        ...position,
        ...props.style
      }}
      className={clsx(
        'surface coloring-solid rounded-md border-2 border-outline-variant shadow-md',
        'data-positioned:animate-pop-in',
        'focus-within:border-primary',
        props.className
      )}
    >
      {children}
    </div>
  )

  if(hasBackgroundOverlay) {
    return (
      <Portal>
        <div
          {...backgroundOverlayProps}
          className={clsx('fixed inset-0 w-screen h-screen', backgroundOverlayProps.className)}
          style={{ zIndex, ...backgroundOverlayProps.style }}
          onClick={event => {
            onBackgroundOverlayClick?.()
            backgroundOverlayProps.onClick?.(event)
          }}
        >
          {container}
        </div>
      </Portal>
    )
  }

  return (
    <Portal>
      {container}
    </Portal>
  )
})