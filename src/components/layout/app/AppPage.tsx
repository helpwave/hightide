import clsx from 'clsx'
import { useCallback, useMemo, useRef, useState, type HTMLAttributes, type ReactNode } from 'react'
import { IconButton } from '../../user-interaction'
import { useHightideTranslation } from '@/src/i18n'
import { MenuIcon, X } from 'lucide-react'
import { useOverlayRegistry } from '@/src/hooks'
import { PropsUtil } from '@/src/utils/propsUtil'
import { VerticalNavigationTree, type NavigationItemData } from '../navigation/navigation-menus/VerticalNavigationTree'
import { FocusTrap } from '../../utils'


export interface AppSidebarProps extends HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean,
  onClose?: () => void,
}

export const AppSidebar = ({ isOpen, onClose, children, ...props }: AppSidebarProps) => {
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
}

export const AppPageSidebarWithNavigation = ({
  header,
  footer,
  navigationItems,
  contentOverwrite,
  ...props
}: AppPageSidebarWithNavigationProps) => {
  return (
    <AppSidebar {...props}>
      <div className="flex-col-0 h-full min-h-0 py-2">
        {header && (
          <div className="flex-col-0 items-start desktop:items-center px-2.5 mb-8">
            {header}
          </div>
        )}
        {navigationItems && !contentOverwrite && (
          <div className="flex-1 min-h-0 pl-2.5 pr-1 py-0.5 overflow-y-auto overscroll-y-contain">
            <VerticalNavigationTree items={navigationItems} />
          </div>
        )}
        {contentOverwrite && (
          <div className="flex-1 min-h-0 pl-2.5 pr-1 py-0.5 overflow-y-auto overscroll-y-contain">
            {contentOverwrite}
          </div>
        )}
        {footer && (
          <div className="flex-col-0 px-2.5 pt-2">
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
  isActive?: boolean,
  url?: string,
  external?: boolean,
  items?: AppPageNavigationItem[],
}

export interface AppPageSidebarProps {
  header: ReactNode,
  items: AppPageNavigationItem[],
  content: ReactNode,
  footer: ReactNode,
}

export interface AppPageProps extends HTMLAttributes<HTMLDivElement> {
  headerActions?: ReactNode[],
  sidebarProps: AppPageSidebarWithNavigationProps,
}

export const AppPage = ({ children, headerActions, sidebarProps, ...props }: AppPageProps) => {
  const translation = useHightideTranslation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toNavigationItems = useCallback((items?: AppPageNavigationItem[]): NavigationItemData[] | undefined => {
    return items?.map((item) => ({
      id: item.id,
      label: (
        <span className={clsx('flex-row-1 items-center', { 'text-primary': item.isActive })}>
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
    })) ?? undefined
  }, [])

  const navigationItems = useMemo(() => toNavigationItems(
    sidebarProps.navigationItems
  ), [sidebarProps.navigationItems, toNavigationItems])

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
