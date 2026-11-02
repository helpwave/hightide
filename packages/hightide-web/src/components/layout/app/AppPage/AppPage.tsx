import type { ComponentRef, ElementType, ReactNode, Ref } from 'react'
import { useCallback, useMemo } from 'react'
import { useControlledState, useStateMachineBinding } from '@helpwave/hightide-utils/hooks'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { FullScreenVerticalNavigation } from '../../../interaction/navigation/FullScreenVerticalNavigation'
import { findActiveIdByUrl, type NavigationItemData } from '../../../interaction/navigation/types'
import type { LinkComponentProps } from '../../../interaction/navigation/VerticalNavigationMenu'
import { AppPageBody, type AppPageBodyProps } from './AppPageBody'
import { AppPageContent, type AppPageContentProps } from './AppPageContent'
import { AppPageContext, useAppPageContext } from './AppPageContext'
import { AppPageHeader, type AppPageHeaderProps } from './AppPageHeader'
import { AppPageLayout, type AppPageLayoutProps } from './AppPageLayout'
import { AppPageMain, type AppPageMainProps } from './AppPageMain'
import { AppPageMenuButton, type AppPageMenuButtonProps } from './AppPageMenuButton'
import { AppPageSidebar, type AppSidebarProps } from './AppPageSidebar'
import { AppPageSidebarFooter, type AppPageSidebarFooterProps } from './AppPageSidebarFooter'
import { AppPageSidebarHeader, type AppPageSidebarHeaderProps } from './AppPageSidebarHeader'
import { AppPageSidebarNav, type AppPageSidebarNavProps } from './AppPageSidebarNav'
import { AppPageStateManager } from './AppPageStateManager'
import type { AppPageEvent, AppPageState } from './AppPageState'

export type AppPageSidebarProps = {
  activeId?: string | null,
  activeUrl?: string,
  header?: ReactNode,
  items?: NavigationItemData[],
  contentOverwrite?: ReactNode,
  footer?: ReactNode,
  LinkComponent?: ElementType<LinkComponentProps>,
}

export type AppPageProps = {
  children?: ReactNode,
  headerActions?: ReactNode[],
  sidebarProps: AppPageSidebarProps,
  noScrolling?: boolean,
  hasSpacer?: boolean,
  isOpen?: boolean,
  initialIsOpen?: boolean,
  onIsOpenChange?: (isOpen: boolean) => void,
  onStateChange?: (state: AppPageState) => void,
  onStateEvent?: (event: AppPageEvent) => void,
  layoutRef?: Ref<ComponentRef<typeof AppPageLayout>>,
  layoutProps?: AppPageLayoutProps,
  sidebarRef?: Ref<ComponentRef<typeof AppPageSidebar>>,
  sidebarLayoutProps?: AppSidebarProps,
  sidebarHeaderRef?: Ref<ComponentRef<typeof AppPageSidebarHeader>>,
  sidebarHeaderProps?: AppPageSidebarHeaderProps,
  sidebarNavRef?: Ref<ComponentRef<typeof AppPageSidebarNav>>,
  sidebarNavProps?: AppPageSidebarNavProps,
  sidebarFooterRef?: Ref<ComponentRef<typeof AppPageSidebarFooter>>,
  sidebarFooterProps?: AppPageSidebarFooterProps,
  bodyRef?: Ref<ComponentRef<typeof AppPageBody>>,
  bodyProps?: AppPageBodyProps,
  headerRef?: Ref<ComponentRef<typeof AppPageHeader>>,
  headerProps?: AppPageHeaderProps,
  menuButtonRef?: Ref<ComponentRef<typeof AppPageMenuButton>>,
  menuButtonProps?: AppPageMenuButtonProps,
  contentRef?: Ref<ComponentRef<typeof AppPageContent>>,
  contentProps?: AppPageContentProps,
  mainRef?: Ref<ComponentRef<typeof AppPageMain>>,
  mainProps?: AppPageMainProps,
}

type AppPageViewProps = Omit<
  AppPageProps,
  'sidebarProps' | 'noScrolling' | 'hasSpacer' | 'isOpen' | 'initialIsOpen' | 'onIsOpenChange' | 'onStateChange' | 'onStateEvent'
> & {
  header?: ReactNode,
  footer?: ReactNode,
}

function AppPageView({
  children,
  headerActions,
  header,
  footer,
  layoutRef,
  layoutProps,
  sidebarRef,
  sidebarLayoutProps,
  sidebarHeaderRef,
  sidebarHeaderProps,
  sidebarNavRef,
  sidebarNavProps,
  sidebarFooterRef,
  sidebarFooterProps,
  bodyRef,
  bodyProps,
  headerRef,
  headerProps,
  menuButtonRef,
  menuButtonProps,
  contentRef,
  contentProps,
  mainRef,
  mainProps,
}: AppPageViewProps) {
  const { state, dispatch, items, LinkComponent, activeId } = useAppPageContext()

  return (
    <AppPageLayout
      {...layoutProps}
      ref={ReactUtils.assingRefsBuilder([layoutRef])}
    >
      <FullScreenVerticalNavigation.StateManager
        state={state}
        onStateChange={(next) => dispatch({ type: next.isOpen ? 'open' : 'close' })}
        items={items ?? []}
        LinkComponent={LinkComponent}
        activeId={activeId}
      >
        <AppPageSidebar
          {...sidebarLayoutProps}
          ref={ReactUtils.assingRefsBuilder([sidebarRef])}
          isOpen={false}
        >
          <div className="app-page-sidebar-with-navigation">
            <AppPageSidebarHeader
              {...sidebarHeaderProps}
              ref={ReactUtils.assingRefsBuilder([sidebarHeaderRef])}
            >
              {header}
            </AppPageSidebarHeader>
            <AppPageSidebarNav
              {...sidebarNavProps}
              ref={ReactUtils.assingRefsBuilder([sidebarNavRef])}
            />
            <AppPageSidebarFooter
              {...sidebarFooterProps}
              ref={ReactUtils.assingRefsBuilder([sidebarFooterRef])}
            >
              {footer}
            </AppPageSidebarFooter>
          </div>
        </AppPageSidebar>
        <AppPageBody
          {...bodyProps}
          ref={ReactUtils.assingRefsBuilder([bodyRef])}
        >
          <AppPageHeader
            {...headerProps}
            ref={ReactUtils.assingRefsBuilder([headerRef])}
          >
            <AppPageMenuButton
              {...menuButtonProps}
              ref={ReactUtils.assingRefsBuilder([menuButtonRef])}
            />
            {headerActions}
          </AppPageHeader>
          <AppPageContent
            {...contentProps}
            ref={ReactUtils.assingRefsBuilder([contentRef])}
          >
            <AppPageMain
              {...mainProps}
              ref={ReactUtils.assingRefsBuilder([mainRef])}
            >
              {children}
            </AppPageMain>
          </AppPageContent>
        </AppPageBody>
        <FullScreenVerticalNavigation.Panel className="desktop:hidden"/>
      </FullScreenVerticalNavigation.StateManager>
    </AppPageLayout>
  )
}

const AppPageComponent = ({
  children,
  headerActions,
  sidebarProps,
  noScrolling = false,
  hasSpacer = true,
  isOpen,
  initialIsOpen = false,
  onIsOpenChange,
  onStateChange,
  onStateEvent,
  ...viewProps
}: AppPageProps) => {
  const [state, setState] = useControlledState<AppPageState>({
    defaultValue: { isOpen: initialIsOpen },
    onValueChange: onStateChange,
  })
  const binding = useStateMachineBinding<AppPageState, boolean>({
    state,
    onStateChange: setState,
    onValueChange: onIsOpenChange,
    value: isOpen,
    inject: useCallback((next: boolean) => ({ isOpen: next }), []),
    get: useCallback((current: AppPageState) => current.isOpen, []),
  })

  const resolvedActiveId = useMemo(() => {
    if (sidebarProps.activeId !== undefined) return sidebarProps.activeId
    if (sidebarProps.activeUrl == null || sidebarProps.items == null) return null
    return findActiveIdByUrl(sidebarProps.items, sidebarProps.activeUrl)
  }, [sidebarProps.activeId, sidebarProps.activeUrl, sidebarProps.items])

  return (
    <AppPageStateManager
      state={binding.state}
      onStateChange={binding.onStateChange}
      onStateEvent={onStateEvent}
      items={sidebarProps.items}
      LinkComponent={sidebarProps.LinkComponent}
      activeId={resolvedActiveId}
      contentOverwrite={sidebarProps.contentOverwrite}
      noScrolling={noScrolling}
      hasSpacer={hasSpacer}
    >
      <AppPageView
        {...viewProps}
        header={sidebarProps.header}
        footer={sidebarProps.footer}
        headerActions={headerActions}
      >
        {children}
      </AppPageView>
    </AppPageStateManager>
  )
}

export const AppPage = Object.assign(AppPageComponent, {
  StateManager: AppPageStateManager,
  Layout: AppPageLayout,
  Sidebar: AppPageSidebar,
  SidebarHeader: AppPageSidebarHeader,
  SidebarNav: AppPageSidebarNav,
  SidebarFooter: AppPageSidebarFooter,
  Body: AppPageBody,
  Header: AppPageHeader,
  MenuButton: AppPageMenuButton,
  Content: AppPageContent,
  Main: AppPageMain,
  Context: AppPageContext,
  Provider: AppPageContext.Provider,
  Consumer: AppPageContext.Consumer,
})
