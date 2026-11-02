import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export type BreadCrumbsLayoutProps = HTMLAttributes<HTMLUListElement>

export const BreadCrumbsLayout = forwardRef<HTMLUListElement, BreadCrumbsLayoutProps>(
  function BreadCrumbsLayout({ className, ...props }, forwardedRef) {
    return (
      <ul
        {...props}
        ref={forwardedRef}
        className={clsx('breadcrumb', className)}
      />
    )
  }
)
