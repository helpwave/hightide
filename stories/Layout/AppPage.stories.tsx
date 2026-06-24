import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Bell, Settings } from 'lucide-react'
import { AppPage } from '@/src/components/layout/app/AppPage'
import { HelpwaveBadge } from '@/src/components/branding/HelpwaveBadge'
import { IconButton } from '@/src/components/user-interaction/IconButton'
import { longNavigationItems } from './Navigation/verticalNavigationSampleItems'

const meta: Meta<typeof AppPage> = {
  component: AppPage,
}

export default meta
type Story = StoryObj<typeof meta>

export const appPage: Story = {
  args: {
    headerActions: [
      <div className="w-full flex-row-0 justify-end" key="header-actions">
        <IconButton tooltip="Notifications" coloringStyle="text">
          <Bell className="size-6" />
        </IconButton>
        <IconButton tooltip="Settings" coloringStyle="text">
          <Settings className="size-6" />
        </IconButton>
      </div>
    ],
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
    return (
      <AppPage
        {...args}
        sidebarProps={{
          header: <HelpwaveBadge size="md" className="shrink-0" />,
          navigationItems: longNavigationItems,
          footer: (
            <p className="typography-body-md text-description">
              {'Welcome to the app page layout. Scroll to see how content flows beneath the sticky header.'}
            </p>
          )
        }}
      />
    )
  },
}
