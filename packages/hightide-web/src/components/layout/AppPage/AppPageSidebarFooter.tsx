import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { Children, forwardRef } from 'react'

export type AppPageSidebarFooterProps = HTMLAttributes<HTMLDivElement>

export const AppPageSidebarFooter = forwardRef<HTMLDivElement, AppPageSidebarFooterProps>(
  function AppPageSidebarFooter({ children, className, ...props }, forwardedRef) {
    if (Children.count(children) === 0) {
      return null
    }

    return (
      <div
        {...props}
        ref={forwardedRef}
        className={clsx('app-page-sidebar-with-navigation-footer', className)}
      >
        {children}
      </div>
    )
  }
)
