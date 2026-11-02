import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { Children, forwardRef } from 'react'

export type AppPageSidebarHeaderProps = HTMLAttributes<HTMLDivElement>

export const AppPageSidebarHeader = forwardRef<HTMLDivElement, AppPageSidebarHeaderProps>(
  function AppPageSidebarHeader({ children, className, ...props }, forwardedRef) {
    if (Children.count(children) === 0) {
      return null
    }

    return (
      <div
        {...props}
        ref={forwardedRef}
        className={clsx('app-page-sidebar-with-navigation-header', className)}
      >
        {children}
      </div>
    )
  }
)
