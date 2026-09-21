import type { HTMLAttributes, RefObject } from 'react'
import { forwardRef, useRef } from 'react'
import type { UseAnchoredPositionOptions } from '../../hooks/useAnchoredPosition'
import { useAnchoredPosition as useAnchoredPosition } from '../../hooks/useAnchoredPosition'
import { ReactUtils } from '@helpwave/hightide-utils/utils'

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
      ref={ReactUtils.assingRefsBuilder([innerRef, forwardRef])}

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