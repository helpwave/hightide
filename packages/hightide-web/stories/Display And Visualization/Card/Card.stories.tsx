import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { action } from 'storybook/actions'
import { Bell, Building2, LogOut, UserRound } from 'lucide-react'
import { Card } from '../../../src/components/display-and-visualization/Card'
import { Divider } from '../../../src/components/layout/Divider'
import { ListActionItem } from '../../../src/components/list/ListActionItem'
import { ListItem } from '../../../src/components/list/ListItem'
import { ListNavigationItem } from '../../../src/components/list/ListNavigationItem'
import { Switch } from '../../../src/components/user-interaction/Switch'

const meta: Meta<typeof Card> = {
  component: Card,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const card: Story = {
  args: {
    size: 'md',
    className: '!p-0',
    children: (
      <>
        <ListItem title="Anna Müller" subtitle="Name" />
        <Divider />
        <ListItem title="anna@example.com" subtitle="Email" />
      </>
    ),
  },
}

export const profileStyle: Story = {
  render: () => (
    <div className="flex-col-5 w-full max-w-md">
      <div className="flex-col-2">
        <span className="typography-caption-sm font-bold uppercase tracking-wide text-description px-1">
          Personal data
        </span>
        <Card className="!p-0">
          <ListItem title="Anna Müller" subtitle="Name" />
          <Divider />
          <ListItem title="12.03.1988" subtitle="Date of birth" />
          <Divider />
          <ListItem title="anna@example.com" subtitle="Email" />
        </Card>
      </div>
      <div className="flex-col-2">
        <span className="typography-caption-sm font-bold uppercase tracking-wide text-description px-1">
          Practice
        </span>
        <Card className="!p-0">
          <ListItem title="Praxis am Park" subtitle="Practice" />
          <Divider />
          <ListNavigationItem
            title="Practice details"
            leading={<Building2 className="size-force-5" />}
            href="#practice-details"
            onClick={action('practice-details')}
          />
        </Card>
      </div>
      <div className="flex-col-2">
        <span className="typography-caption-sm font-bold uppercase tracking-wide text-description px-1">
          Settings
        </span>
        <Card className="!p-0">
          <ListActionItem
            title="Notifications"
            leading={<Bell className="size-force-5" />}
            trailing={<Switch />}
          />
          <Divider />
          <ListNavigationItem
            title="Account"
            leading={<UserRound className="size-force-5" />}
            href="#account"
            onClick={action('account')}
          />
          <Divider />
          <ListActionItem
            title="Log out"
            color="negative"
            leading={<LogOut className="size-force-5" />}
            onClick={action('logout')}
          />
        </Card>
      </div>
    </div>
  ),
}
