import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { VerticalNavigationMenu } from '../../interaction/navigation/VerticalNavigationMenu'
import { useAppPageContext } from './AppPageContext'

export type AppPageSidebarNavProps = HTMLAttributes<HTMLElement>

export const AppPageSidebarNav = forwardRef<HTMLElement, AppPageSidebarNavProps>(
  function AppPageSidebarNav({ className, ...props }, forwardedRef) {
    const { items, LinkComponent, activeId, contentOverwrite } = useAppPageContext()

    if (!contentOverwrite && !items) {
      return null
    }

    return (
      <nav
        {...props}
        ref={forwardedRef}
        className={clsx('app-page-sidebar-with-navigation-scroll', className)}
      >
        {contentOverwrite ?? (
          <VerticalNavigationMenu
            items={items ?? []}
            LinkComponent={LinkComponent}
            activeId={activeId}
          />
        )}
      </nav>
    )
  }
)
