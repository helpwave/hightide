import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export type BreadCrumbsDividerProps = HTMLAttributes<HTMLSpanElement>

export const BreadCrumbsDivider = forwardRef<HTMLSpanElement, BreadCrumbsDividerProps>(
  function BreadCrumbsDivider({ children, className, ...props }, forwardedRef) {
    if (children === null) {
      return null
    }

    return (
      <span
        {...props}
        ref={forwardedRef}
        className={clsx('breadcrumb-divider', className)}
      >
        {children ?? '/'}
      </span>
    )
  }
)
