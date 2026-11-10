import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export type AppPageHeaderProps = HTMLAttributes<HTMLElement>

export const AppPageHeader = forwardRef<HTMLElement, AppPageHeaderProps>(
  function AppPageHeader({ className, ...props }, forwardedRef) {
    return (
      <header
        {...props}
        ref={forwardedRef}
        className={clsx('app-page-header', className)}
      />
    )
  }
)
