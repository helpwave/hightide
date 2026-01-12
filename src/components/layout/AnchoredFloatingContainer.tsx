import type { HTMLAttributes, RefObject } from 'react'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import type { UseAnchoredPositionOptions } from '@/src/hooks/useAnchoredPosition'
import { useAnchoredPosition as useAnchoredPosition } from '@/src/hooks/useAnchoredPosition'
import { useOverlayRegistry } from '@/src/hooks/useOverlayRegistry'

export type BackgroundOverlayProps = HTMLAttributes<HTMLDivElement>

export interface AnchoredFloatingContainerProps extends HTMLAttributes<HTMLDivElement> {
  anchor?: RefObject<HTMLElement>,
  options?: UseAnchoredPositionOptions,
}

export const AnchoredFloatingContainer = forwardRef<HTMLDivElement, AnchoredFloatingContainerProps>(function FloatingContainer({
  children,
  anchor,
  options = {},
  ...props
}, forwardRef) {
  const innerRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(forwardRef, () => innerRef.current)

  const position = useAnchoredPosition({
    ...options,
    container: innerRef,
    anchor: anchor,
  })

  const { zIndex } = useOverlayRegistry()

  return (
    <div
      {...props}
      ref={innerRef}

      data-positioned={position ? '' : undefined}

      style={{
        zIndex,
        overflow: 'hidden',
        ...position,
        ...props.style
      }}
    >
      {children}
    </div>
  )
})