import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import type { MouseEvent } from 'react'
import { useSyncExternalStore } from 'react'
import {
  Activity,
  Bell,
  BookOpen,
  ClipboardCheck,
  LayoutDashboard,
  Package,
  Settings,
  Users
} from 'lucide-react'
import type { AppPageNavigationItem } from '@/src/components/layout/app/AppPage'
import { AppPage } from '@/src/components/layout/app/AppPage'
import { HelpwaveBadge } from '@/src/components/branding/HelpwaveBadge'
import { IconButton } from '@/src/components/user-interaction/IconButton'

/**
 * Tiny external store holding the demo's "current route". Storybook has no real
 * pages to navigate between, so `handleNavigation` (below) observes the clicks the
 * sidebar's `next/link` items produce and publishes the target here; the story
 * then re-renders with the new active item + content — in place, with no full
 * page reload, mirroring what the router does in a real app.
 */
function createRouteStore(initial: string) {
  let current = initial
  const listeners = new Set<() => void>()
  return {
    get: () => current,
    set: (next: string) => {
      if (next === current) return
      current = next
      listeners.forEach((listener) => listener())
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

const initialRoute = '/dashboard'
const routeStore = createRouteStore(initialRoute)

const navigationItems: AppPageNavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="size-5" />, url: '/dashboard' },
  { id: 'patients', label: 'Patients', icon: <Users className="size-5" />, url: '/patients' },
  { id: 'tasks', label: 'Tasks', icon: <ClipboardCheck className="size-5" />, url: '/tasks' },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="size-5" />,
    items: [
      { id: 'settings-general', label: 'General', url: '/settings/general' },
      { id: 'settings-team', label: 'Team', url: '/settings/team' },
      { id: 'settings-billing', label: 'Billing', url: '/settings/billing' },
    ],
  },
  {
    id: 'resources',
    label: 'Resources',
    icon: <Package className="size-5" />,
    items: [
      {
        id: 'docs',
        label: 'Documentation',
        icon: <BookOpen className="size-5" />,
        url: 'https://helpwave.de/product/tasks',
        external: true,
      },
      {
        id: 'status',
        label: 'Status page',
        icon: <Activity className="size-5" />,
        url: 'https://helpwave.de',
        external: true,
      },
    ],
  },
]

const routeLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/patients': 'Patients',
  '/tasks': 'Tasks',
  '/settings/general': 'Settings · General',
  '/settings/team': 'Settings · Team',
  '/settings/billing': 'Settings · Billing',
}

const meta: Meta<typeof AppPage> = {
  component: AppPage,
  parameters: {
    nextjs: {
      // Provide a (mocked) Next router context so `next/link` handles clicks
      // itself — it prevents the browser's default navigation and never reloads
      // the page, which is the behaviour this story demonstrates.
      appDirectory: true,
      navigation: { pathname: initialRoute },
    },
  },
}

/**
 * Storybook has no real pages to route between, so we observe the navigation the
 * sidebar links trigger (a capture-phase click, which also covers keyboard
 * activation since that synthesizes a click on the same anchor) and reflect the
 * new route in the store. Internal links update the demo in place; external ones
 * (absolute URLs) are left to open in a new tab.
 */
function handleNavigation(event: MouseEvent<HTMLDivElement>) {
  const anchor = (event.target as Element).closest<HTMLAnchorElement>(
    'a[data-name="vertical-navigation-item-link"]'
  )
  const href = anchor?.getAttribute('href')
  if (href == null || /^(https?:)?\/\//.test(href)) return
  routeStore.set(href)
}

export default meta
type Story = StoryObj<typeof meta>

export const appPage: Story = {
  args: {
    headerActions: [(
      <div className="w-full flex-row-0 justify-end" key="header-actions">
        <IconButton tooltip="Notifications" coloringStyle="text">
          <Bell className="size-6" />
        </IconButton>
        <IconButton tooltip="Settings" coloringStyle="text">
          <Settings className="size-6" />
        </IconButton>
      </div>
    )],
  },
  decorators: [
    (Story) => (
      <>
        <style>{'#storybook-root > main { padding: 0 !important; }'}</style>
        <Story />
      </>
    ),
  ],
  render: (args) => {
    const currentPath = useSyncExternalStore(routeStore.subscribe, routeStore.get, routeStore.get)
    const currentLabel = routeLabels[currentPath] ?? currentPath

    return (
      <div className="contents" onClickCapture={handleNavigation}>
        <AppPage
          {...args}
          sidebarProps={{
            header: <HelpwaveBadge size="md" className="shrink-0" />,
            items: navigationItems,
            // Drives the highlighted item; kept in sync with the observed navigation.
            activeUrl: currentPath,
            footer: (
              <p className="typography-body-md text-description">
              Navigate through helpwave products and organization settings.
              </p>
            ),
          }}
        >
          <div className="flex-col-4">
            <div className="flex-col-1">
              <span className="typography-body-md text-description">Current route</span>
              <h1 className="typography-headline-md">{currentLabel}</h1>
              <code className="typography-body-md text-primary">{currentPath}</code>
            </div>
            <div className="flex-col-1 rounded-lg border border-border p-4">
              <span className="typography-title-sm">Client-side routing</span>
              <p className="typography-body-md text-description">
              Clicking a sidebar entry navigates through <code>next/link</code> — the highlighted
              item and this content update instantly, with no full page reload. In a real app the
              browser back / forward buttons move through the history the same way. External links
              (with the arrow icon) open in a new tab.
              </p>
            </div>
            {Array.from({ length: 12 }, (_, index) => (
              <div
                key={index}
                className="surface coloring-solid rounded-lg p-4 typography-label-md"
              >
                {`${currentLabel} · Section ${index + 1}`}
              </div>
            ))}
          </div>
        </AppPage>
      </div>
    )
  },
}
