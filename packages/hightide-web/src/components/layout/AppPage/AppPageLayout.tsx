import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export type AppPageLayoutProps = HTMLAttributes<HTMLDivElement>

export const AppPageLayout = forwardRef<HTMLDivElement, AppPageLayoutProps>(
  function AppPageLayout({ className, ...props }, forwardedRef) {
    return (
      <div
        {...props}
        ref={forwardedRef}
        className={clsx('app-page', className)}
      />
    )
  }
)
