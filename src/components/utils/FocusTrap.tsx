'use client'

import type { HTMLAttributes, MutableRefObject } from 'react'
import { useRef } from 'react'
import { useImperativeHandle } from 'react'
import { forwardRef } from 'react'
import { useFocusTrap } from '@/src/hooks/focus/useFocusTrap'

const FocusGuard = () => {
  return (
    <div
      tabIndex={0}
      style={{
        boxShadow: 'none',
        outline: 'none',
        opacity: 0,
        position: 'fixed',
        pointerEvents: 'none',
        touchAction: 'none',
      }}
    />
  )
}

export type FocusTrapProps = HTMLAttributes<HTMLDivElement> & {
  active?: boolean,
  initialFocus?: MutableRefObject<HTMLElement>,
}

export const FocusTrap = forwardRef<HTMLDivElement, FocusTrapProps>(function FocusTrap({
                                                                                         active = true,
                                                                                         initialFocus,
                                                                                         ...props
                                                                                       }, forwardedRef) {
  const innerRef = useRef<HTMLInputElement>(null)
  useImperativeHandle(forwardedRef, () => innerRef.current)

  useFocusTrap({ container: innerRef, active, initialFocus })

  return (
    <>
      {active && (<FocusGuard/>)}
      <div ref={innerRef} {...props}/>
      {active && (<FocusGuard/>)}
    </>
  )
})