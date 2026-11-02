import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import clsx from 'clsx'

export type HorizontalNavigationBarBarProps = HTMLAttributes<HTMLDivElement>

export const HorizontalNavigationBarBar = forwardRef<HTMLDivElement, HorizontalNavigationBarBarProps>(
  function HorizontalNavigationBarBar({ className, ...props }, forwardedRef) {
    return (
      <div
        {...props}
        ref={forwardedRef}
        className={clsx('horizontal-navigation-bar', className)}
      />
    )
  }
)
