'use client'

import type { HTMLAttributes, PropsWithChildren } from 'react'
import { useRef } from 'react'
import { forwardRef } from 'react'
import type { UseFocusTrapProps } from '@/src/hooks/focus/useFocusTrap'
import { useFocusTrap } from '@/src/hooks/focus/useFocusTrap'

export interface FocusTrapProps extends PropsWithChildren, UseFocusTrapProps {}

export const FocusTrap = ({ children, ...props }: FocusTrapProps) => {

  useFocusTrap({
    ...props
  })

  return children
}


export interface FocusTrapWrapperProps extends HTMLAttributes<HTMLDivElement>, Omit<FocusTrapProps, 'container'> {}

/**
 * A wrapper for the useFocusTrap hook that directly renders it to a div
 */
export const FocusTrapWrapper = forwardRef<HTMLDivElement, FocusTrapWrapperProps>(function FocusTrap({
  active,
  initialFocus,
  ...props
}, forwardedRef) {
  const innerRef = useRef<HTMLDivElement>(null)

  useFocusTrap({ container: innerRef, active, initialFocus })

  return (
    <div
      ref={(node) => {
        innerRef.current = node

        if (typeof forwardedRef === 'function') {
          forwardedRef(node)
        } else if (forwardedRef) {
          forwardedRef.current = node
        }
      }}
      {...props}
    />
  )
})