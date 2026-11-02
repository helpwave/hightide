import type { Meta, StoryObj } from '@storybook/react-vite'
import { Bell, File, Folder, Package, Settings } from 'lucide-react'
import { AppPage } from '../../../src/components/layout/app/AppPage'
import type { NavigationItemData } from '../../../src/components/interaction/navigation/types'
import { FullScreenVerticalNavigation } from '../../../src/components/interaction/navigation/FullScreenVerticalNavigation'
import { HelpwaveBadge } from '../../../src/components/branding/visualization/HelpwaveBadge'
import { IconButton } from '../../../src/components/interaction/IconButton'
import { useEffect, useState } from 'react'

const initialNavigationItems: NavigationItemData[] = [
  {
    id: 'products',
    label: 'Products',
    icon: <Package className="size-5" />,
    items: [
      {
        id: 'clinical',
        label: 'Clinical',
        items: [
          { id: 'ward-management', label: 'Ward management', url: '#' },
          { id: 'patient-overview', label: 'Patient overview', url: '#' },
        ],
      },
      {
        id: 'operations',
        label: 'Operations',
        icon: <Settings className="size-5" />,
        items: [
          { id: 'task-board', label: (<div className="flex-row-2 justify-between w-full">{'Task board'}<span className="text-description">8</span></div>), url: 'https://helpwave.de/product/tasks', external: true },
          { id: 'staff-planning', label: 'Staff planning', url: 'https://helpwave.de/product/staff', external: true },
        ],
      },
    ],
  },
  {
    id: 'noLink',
    label: 'No Link And Children',
  },
  {
    id: 'customLabel',
    label: (<div className="flex-row-2 justify-between w-full">{'With Label'}<span className="text-description">8</span></div>),
  },
  {
    id: 'children',
    label: 'Children',
    items: [
      {
        id: 'linkAndChildren-1',
        label: 'SubItem 1',
        url: '#',
      },
      {
        id: 'linkAndChildren-2',
        label: 'SubItem 2',
        url: '#',
      }
    ]
  },
]

const additionalNavigationItems: NavigationItemData[] = [
  ...Array.from({ length: 5 }, (_, sectionIndex) => ({
    id: `section-${sectionIndex}`,
    label: `Section ${sectionIndex + 1}`,
    icon: <Folder className="size-5" />,
    items: Array.from({ length: 6 }, (_, itemIndex) => ({
      id: `section-${sectionIndex}-item-${itemIndex}`,
      label: `Item ${itemIndex + 1}`,
      icon: <File className="size-5" />,
      url: sectionIndex === 1 && itemIndex === 1 ? '#test' : '#',
    })),
  })),
]

const meta: Meta<typeof AppPage> = {
  component: AppPage,
}

export default meta
type Story = StoryObj<typeof meta>

const pageDecorators: Story['decorators'] = [
  (Story) => (
    <>
      <style>{'#storybook-root > main { padding: 0 !important; }'}</style>
      <Story />
    </>
  ),
]

const headerActions = [(
  <div className="w-full flex-row-0 justify-end" key="header-actions">
    <IconButton tooltip="Notifications" variant="foreground">
      <Bell className="size-6" />
    </IconButton>
    <IconButton tooltip="Settings" variant="foreground">
      <Settings className="size-6" />
    </IconButton>
  </div>
)]

const pageChildren = (
  <div className="flex-col-4">
    <h1 className="typography-headline-md">Dashboard</h1>
    <p className="typography-body-md text-description">
      Welcome to the app page layout. Scroll to see how content flows beneath the sticky header.
    </p>
    {Array.from({ length: 12 }, (_, index) => (
      <div
        key={index}
        className="rounded-lg p-4 typography-label-md"
      >
        {`Section ${index + 1}`}
      </div>
    ))}
  </div>
)

export const appPage: Story = {
  args: {
    headerActions,
    children: pageChildren,
  },
  decorators: pageDecorators,
  render: ({ children, ...args }) => {
    const [navigationItems, setNavigationItems] = useState(() => [...initialNavigationItems])

    useEffect(() => {
      const timeout = setTimeout(() => {
        setNavigationItems([...initialNavigationItems, ...additionalNavigationItems])
      }, 1000)

      return () => clearTimeout(timeout)
    }, [])

    return (
      <AppPage
        {...args}
        sidebarProps={{
          header: <HelpwaveBadge size="md" className="shrink-0" />,
          items: navigationItems,
          footer: (
            <p className="typography-body-md text-description">
              Navigate through helpwave products and organization settings.
            </p>
          ),
          activeUrl: '#test',
        }}
      >
        {args.noScrolling ? (
          <div className="h-full flex-col-2 overflow-auto">
            {children}
          </div>
        ) : children}
      </AppPage>
    )
  },
}

export const composed: Story = {
  args: {
    headerActions,
    children: pageChildren,
    sidebarProps: {
      header: <HelpwaveBadge size="md" className="shrink-0" />,
      items: initialNavigationItems,
      footer: (
        <p className="typography-body-md text-description">
          Navigate through helpwave products and organization settings.
        </p>
      ),
      activeUrl: '#test',
    },
  },
  decorators: pageDecorators,
  render: (args) => {
    const [state, setState] = useState({ isOpen: args.isOpen ?? false })
    const items = args.sidebarProps.items
    const activeId = args.sidebarProps.activeId ?? null

    return (
      <AppPage.StateManager
        state={state}
        onStateChange={setState}
        items={items}
        LinkComponent={args.sidebarProps.LinkComponent}
        activeId={activeId}
        contentOverwrite={args.sidebarProps.contentOverwrite}
        noScrolling={args.noScrolling}
        hasSpacer={args.hasSpacer}
      >
        <AppPage.Layout {...args.layoutProps}>
          <FullScreenVerticalNavigation.StateManager
            state={state}
            onStateChange={setState}
            items={items ?? []}
            LinkComponent={args.sidebarProps.LinkComponent}
            activeId={activeId}
          >
            <AppPage.Sidebar isOpen={false} {...args.sidebarLayoutProps}>
              <div className="app-page-sidebar-with-navigation">
                <AppPage.SidebarHeader {...args.sidebarHeaderProps}>
                  {args.sidebarProps.header}
                </AppPage.SidebarHeader>
                <AppPage.SidebarNav {...args.sidebarNavProps}/>
                <AppPage.SidebarFooter {...args.sidebarFooterProps}>
                  {args.sidebarProps.footer}
                </AppPage.SidebarFooter>
              </div>
            </AppPage.Sidebar>
            <AppPage.Body {...args.bodyProps}>
              <AppPage.Header {...args.headerProps}>
                <AppPage.MenuButton {...args.menuButtonProps}/>
                {args.headerActions}
              </AppPage.Header>
              <AppPage.Content {...args.contentProps}>
                <AppPage.Main {...args.mainProps}>
                  {args.noScrolling ? (
                    <div className="h-full flex-col-2 overflow-auto">
                      {args.children}
                    </div>
                  ) : args.children}
                </AppPage.Main>
              </AppPage.Content>
            </AppPage.Body>
            <FullScreenVerticalNavigation.Panel className="desktop:hidden"/>
          </FullScreenVerticalNavigation.StateManager>
        </AppPage.Layout>
      </AppPage.StateManager>
    )
  },
}
