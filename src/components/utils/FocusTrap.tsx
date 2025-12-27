'use client'

import type { HTMLAttributes, RefObject } from 'react'
import { useRef } from 'react'
import { useImperativeHandle } from 'react'
import { forwardRef } from 'react'
import { useFocusTrap } from '@/src/hooks/focus/useFocusTrap'

export type FocusTrapProps = HTMLAttributes<HTMLDivElement> & {
  active?: boolean,
  initialFocus?: RefObject<HTMLElement | null>,
  /**
   * Whether to focus the first element when the initialFocus isn't provided
   *
   * Focuses the container instead
   */
  focusFirst?: boolean,
}

/**
 * A wrapper for the useFocusTrap hook that directly renders it to a div
 */
export const FocusTrap = forwardRef<HTMLDivElement, FocusTrapProps>(function FocusTrap({
  active = true,
  initialFocus,
  focusFirst = false,
  ...props
}, forwardedRef) {
  const innerRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(forwardedRef, () => innerRef.current)

  useFocusTrap({ container: innerRef, active, initialFocus, focusFirst })

  return (
    <div ref={innerRef} {...props}/>
  )
})