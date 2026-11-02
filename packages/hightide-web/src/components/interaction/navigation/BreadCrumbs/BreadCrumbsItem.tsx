import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export type BreadCrumbsItemProps = HTMLAttributes<HTMLLIElement>

export const BreadCrumbsItem = forwardRef<HTMLLIElement, BreadCrumbsItemProps>(
  function BreadCrumbsItem({ className, ...props }, forwardedRef) {
    return (
      <li
        {...props}
        ref={forwardedRef}
        className={clsx('breadcrumb-item', className)}
      />
    )
  }
)
