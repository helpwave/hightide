import clsx from 'clsx'
import type { ElementType } from 'react'
import { useMemo, useRef, useState, type HTMLAttributes, type ReactNode } from 'react'
import { IconButton } from '../../interaction/IconButton'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { X } from 'lucide-react'
import { Icon } from '../../visualization/Icon'
import { useOverlayRegistry } from '@helpwave/hightide-utils/hooks'
import { PropsUtil } from '../../../utils/propsUtil'
import { FullScreenVerticalNavigation } from '../../interaction/navigation/FullScreenVerticalNavigation'
import { VerticalNavigationMenu, type LinkComponentProps } from '../../interaction/navigation/VerticalNavigationMenu'
import { findActiveIdByUrl, type NavigationItemData } from '../../interaction/navigation/types'
import { FocusTrap } from '../../interaction/FocusTrap'

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
          className="app-sidebar-backdrop"
          onClick={onClose}
          role="presentation"
        />
      )}
      <div
        className="app-sidebar-container"
        data-open={PropsUtil.dataAttributes.bool(isOpen)}
        style={{ zIndex }}
      >
        <FocusTrap
          active={isOpen}
          container={ref}
        >
          <aside
            {...props}
            ref={ref}
            data-open={PropsUtil.dataAttributes.bool(isOpen)}
            className={clsx('app-sidebar-content', props.className)}>
            <IconButton
              className="app-sidebar-close-button"
              tooltip={translation('close')}
              onClick={onClose}
              variant="foreground"
              color="neutral"
            >
              <Icon icon={X} />
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
  activeId?: string | null,
  LinkComponent?: ElementType<LinkComponentProps>,
}

export const AppPageSidebarWithNavigation = ({
  header,
  footer,
  navigationItems,
  contentOverwrite,
  activeId,
  LinkComponent,
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
          <nav className="app-page-sidebar-with-navigation-scroll">
            <VerticalNavigationMenu
              items={navigationItems}
              LinkComponent={LinkComponent}
              activeId={activeId}
            />
          </nav>
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

export interface AppPageSidebarProps {
  activeId?: string | null,
  activeUrl?: string,
  header?: ReactNode,
  items?: NavigationItemData[],
  contentOverwrite?: ReactNode,
  footer?: ReactNode,
  LinkComponent?: ElementType<LinkComponentProps>,
}

export interface AppPageProps extends HTMLAttributes<HTMLDivElement> {
  headerActions?: ReactNode[],
  sidebarProps: AppPageSidebarProps,
  noScrolling?: boolean,
  hasSpacer?: boolean,
}

export const AppPage = ({
  children,
  headerActions,
  sidebarProps,
  noScrolling = false,
  hasSpacer = true,
  ...props }: AppPageProps) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  const resolvedActiveId = useMemo(() => {
    if (sidebarProps.activeId !== undefined) return sidebarProps.activeId
    if (sidebarProps.activeUrl == null || sidebarProps.items == null) return null
    return findActiveIdByUrl(sidebarProps.items, sidebarProps.activeUrl)
  }, [sidebarProps.activeId, sidebarProps.activeUrl, sidebarProps.items])

  const navigationItems = sidebarProps.items ?? []

  return (
    <div
      {...props}
      className={clsx('app-page', props.className)}>
      <FullScreenVerticalNavigation
        items={navigationItems}
        LinkComponent={sidebarProps.LinkComponent}
        activeId={resolvedActiveId}
        isOpen={isMobileNavOpen}
        onIsOpenChange={setIsMobileNavOpen}
      >
        <AppPageSidebarWithNavigation
          isOpen={false}
          header={sidebarProps.header}
          footer={sidebarProps.footer}
          navigationItems={sidebarProps.items}
          contentOverwrite={sidebarProps.contentOverwrite}
          activeId={resolvedActiveId}
          LinkComponent={sidebarProps.LinkComponent}
        />
        <div className="app-page-body">
          <header className="app-page-header">
            <FullScreenVerticalNavigation.Trigger className="app-page-menu-button" />
            {headerActions}
          </header>
          <div className="app-page-content" data-no-scrolling={noScrolling ? '' : undefined}>
            <main className="app-page-main-content" data-outer-no-scrolling={noScrolling ? '' : undefined}>
              {children}
              {hasSpacer && (<div className="app-page-main-spacer" />)}
            </main>
          </div>
        </div>
        <FullScreenVerticalNavigation.Panel className="desktop:hidden" />
      </FullScreenVerticalNavigation>
    </div>
  )
}
