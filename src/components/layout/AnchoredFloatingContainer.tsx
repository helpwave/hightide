import type { HTMLAttributes, RefObject } from 'react'
import { forwardRef, useRef } from 'react'
import type { UseAnchoredPositionOptions } from '@/src/hooks/useAnchoredPosition'
import { useAnchoredPosition as useAnchoredPosition } from '@/src/hooks/useAnchoredPosition'

export type BackgroundOverlayProps = HTMLAttributes<HTMLDivElement>

export interface AnchoredFloatingContainerProps extends HTMLAttributes<HTMLDivElement> {
  anchor: RefObject<HTMLElement | null>,
  options?: UseAnchoredPositionOptions,
  active?: boolean,
}

export const AnchoredFloatingContainer = forwardRef<HTMLDivElement, AnchoredFloatingContainerProps>(function FloatingContainer({
  children,
  anchor,
  options = {},
  active = true,
  ...props
}, forwardRef) {
  const innerRef = useRef<HTMLDivElement>(null)

  const position = useAnchoredPosition({
    ...options,
    container: innerRef,
    anchor: anchor,
    active,
  })

  return (
    <div
      {...props}
      ref={(el) => {
        innerRef.current = el
        if(!forwardRef) return
        if(typeof forwardRef === 'function') {
          forwardRef(el)
        } else {
          forwardRef.current = el
        }
      }}

      data-positioned={position ? '' : undefined}

      style={{
        overflow: 'hidden',
        ...position,
        ...props.style
      }}
    >
      {children}
    </div>
  )
})