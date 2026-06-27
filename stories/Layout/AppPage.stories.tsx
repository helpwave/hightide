import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Bell, File, Folder, Package, Settings } from 'lucide-react'
import type { AppPageNavigationItem } from '@/src/components/layout/app/AppPage'
import { AppPage } from '@/src/components/layout/app/AppPage'
import { HelpwaveBadge } from '@/src/components/branding/HelpwaveBadge'
import { IconButton } from '@/src/components/user-interaction/IconButton'
import { useEffect, useState } from 'react'

const initialNavigationItems: AppPageNavigationItem[] = [
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
          { id: 'task-board', label: 'Task board', url: 'https://helpwave.de/product/tasks', external: true },
          { id: 'staff-planning', label: 'Staff planning', url: 'https://helpwave.de/product/staff', external: true },
        ],
      },
    ],
  },
]

const additionalNavigationItems: AppPageNavigationItem[] = [
  ...Array.from({ length: 10 }, (_, sectionIndex) => ({
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
    children: (
      <div className="flex-col-4">
        <h1 className="typography-headline-md">Dashboard</h1>
        <p className="typography-body-md text-description">
          Welcome to the app page layout. Scroll to see how content flows beneath the sticky header.
        </p>
        {Array.from({ length: 12 }, (_, index) => (
          <div
            key={index}
            className="surface coloring-solid rounded-lg p-4 typography-label-md"
          >
            {`Section ${index + 1}`}
          </div>
        ))}
      </div>
    ),
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
      />
    )
  },
}
