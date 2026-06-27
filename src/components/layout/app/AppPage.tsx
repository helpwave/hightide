import clsx from 'clsx'
import { useCallback, useMemo, useRef, useState, type HTMLAttributes, type ReactNode } from 'react'
import { IconButton } from '../../user-interaction/IconButton'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { MenuIcon, X } from 'lucide-react'
import { useOverlayRegistry } from '@/src/hooks/useOverlayRegistry'
import { PropsUtil } from '@/src/utils/propsUtil'
import { VerticalNavigationTree, type NavigationItemData } from '../navigation/navigation-menus/VerticalNavigationTree'
import { FocusTrap } from '../../utils/FocusTrap'

export interface AppSidebarProps extends HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean,
  onClose?: () => void,
}

export const AppSidebar = ({ isOpen = false, onClose, children, ...props }: AppSidebarProps) => {
  const translation = useHightideTranslation()
  const { zIndex } = useOverlayRegistry({ isActive: isOpen })
  const ref = useRef<HTMLDivElement>(null)

  return (
    <>
      {isOpen && (
        <div
          data-name="app-sidebar-backdrop"
          onClick={onClose}
          role="presentation"
        />
      )}
      <div
        data-name="app-sidebar-container"
        data-open={PropsUtil.dataAttributes.bool(isOpen)}
        style={{ zIndex }}
      >
        <FocusTrap
          active={isOpen}
          container={ref}
        >
          <aside
            ref={ref}
            {...props}
            data-name="app-sidebar-content"
            data-open={PropsUtil.dataAttributes.bool(isOpen)}
            className={clsx(props.className)}
          >
            <IconButton
              className="app-sidebar-close-button"
              tooltip={translation('close')}
              onClick={onClose}
              coloringStyle="text"
              color="neutral"
            >
              <X className="size-6" />
            </IconButton>
            {children}
          </aside>
        </FocusTrap>
      </div>
    </>
  )
}

export interface AppPageSidebarWithNavigationProps extends AppSidebarProps {
  header?: ReactNode,
  footer?: ReactNode,
  navigationItems?: NavigationItemData[],
  contentOverwrite?: ReactNode,
  initialFocusedId?: string,
  focusedId?: string | null,
  onFocusedIdChange?: (focusedId: string | null) => void,
  activeId?: string | null,
}

export const AppPageSidebarWithNavigation = ({
  header,
  footer,
  navigationItems,
  contentOverwrite,
  initialFocusedId,
  focusedId,
  onFocusedIdChange,
  activeId,
  ...props
}: AppPageSidebarWithNavigationProps) => {
  return (
    <AppSidebar {...props}>
      <div className="app-page-sidebar-with-navigation">
        {header && (
          <div className="app-page-sidebar-with-navigation-header">
            {header}
          </div>
        )}
        {navigationItems && !contentOverwrite && (
          <div className="app-page-sidebar-with-navigation-scroll">
            <VerticalNavigationTree
              items={navigationItems}
              initialFocusedId={initialFocusedId}
              focusedId={focusedId}
              onFocusedIdChange={onFocusedIdChange}
              activeId={activeId}
            />
          </div>
        )}
        {contentOverwrite && (
          <div className="app-page-sidebar-with-navigation-scroll">
            {contentOverwrite}
          </div>
        )}
        {footer && (
          <div className="app-page-sidebar-with-navigation-footer">
            {footer}
          </div>
        )}
      </div>
    </AppSidebar>
  )
}

export interface AppPageNavigationItem {
  id: string,
  label: ReactNode,
  icon?: ReactNode,
  url?: string,
  external?: boolean,
  items?: AppPageNavigationItem[],
}

function findActiveIdByUrl(
  items: ReadonlyArray<AppPageNavigationItem>,
  activeUrl: string
): string | null {
  for (const item of items) {
    if (item.url === activeUrl) return item.id
    if (item.items != null) {
      const found = findActiveIdByUrl(item.items, activeUrl)
      if (found != null) return found
    }
  }
  return null
}

export interface AppPageSidebarProps {
  initialFocusedId?: string,
  focusedId?: string | null,
  onFocusedIdChange?: (focusedId: string | null) => void,
  activeId?: string | null,
  activeUrl?: string,
  header?: ReactNode,
  items?: AppPageNavigationItem[],
  contentOverwrite?: ReactNode,
  footer?: ReactNode,
}

export interface AppPageProps extends HTMLAttributes<HTMLDivElement> {
  headerActions?: ReactNode[],
  sidebarProps: AppPageSidebarProps,
}

export const AppPage = ({ children, headerActions, sidebarProps, ...props }: AppPageProps) => {
  const translation = useHightideTranslation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const resolvedActiveId = useMemo(() => {
    if (sidebarProps.activeId !== undefined) return sidebarProps.activeId
    if (sidebarProps.activeUrl == null || sidebarProps.items == null) return null
    return findActiveIdByUrl(sidebarProps.items, sidebarProps.activeUrl)
  }, [sidebarProps.activeId, sidebarProps.activeUrl, sidebarProps.items])

  const toNavigationItems = useCallback((items?: AppPageNavigationItem[]): NavigationItemData[] | undefined => {
    return items?.map((item) => {
      const isActive = item.id === resolvedActiveId
      return ({
        id: item.id,
        label: (
          <span className="app-page-navigation-item-label" data-active-page={isActive ? '' : undefined}>
            {item.icon && (
              <span className="size-5">
                {item.icon}
              </span>
            )}
            {item.label}
          </span>
        ),
        url: item.url,
        external: item.external,
        items: toNavigationItems(item.items),
      })
    }) ?? undefined
  }, [resolvedActiveId])

  const navigationItems = useMemo(() => toNavigationItems(
    sidebarProps.items
  ), [sidebarProps.items, toNavigationItems])

  return (
    <div
      {...props}
      data-name="app-page"
      className={clsx(props.className)}
    >
      <AppPageSidebarWithNavigation
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        header={sidebarProps.header}
        footer={sidebarProps.footer}
        navigationItems={navigationItems}
        contentOverwrite={sidebarProps.contentOverwrite}
        initialFocusedId={sidebarProps.initialFocusedId}
        focusedId={sidebarProps.focusedId}
        onFocusedIdChange={sidebarProps.onFocusedIdChange}
        activeId={resolvedActiveId}
      />
      <div data-name="app-page-content">
        <header data-name="app-page-header">
          <IconButton
            className="app-page-menu-button"
            tooltip={translation('menu')}
            onClick={() => setIsSidebarOpen(prev => !prev)}
            coloringStyle="text"
          >
            <MenuIcon />
          </IconButton>
          {headerActions}
        </header>
        <main data-name="app-page-main">
          {children}
          <div data-name="app-page-main-spacer" />
        </main>
      </div>
    </div>
  )
}
