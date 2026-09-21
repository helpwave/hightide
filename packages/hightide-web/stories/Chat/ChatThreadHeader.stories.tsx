import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { action } from 'storybook/actions'
import { ChevronLeft, EllipsisVertical, Phone, UserRoundPlus } from 'lucide-react'
import { ChatThreadHeader } from '../../src/components/chat/ChatThreadHeader'
import { IconButton } from '../../src/components/user-interaction/IconButton'

const meta: Meta<typeof ChatThreadHeader> = {
  component: ChatThreadHeader,
}

export default meta
type Story = StoryObj<typeof meta>

export const chatThreadHeader: Story = {
  args: {
    leftActions: (
      <IconButton tooltip="Zurück" size="sm" color="neutral" coloringStyle="text" onClick={action('onBack')}>
        <ChevronLeft/>
      </IconButton>
    ),
    avatar: {
      name: 'Jonas Wellermann',
      status: 'online',
    },
    title: 'Jonas Wellermann',
    subtitle: 'geb. 14.03.1982 · Vers.-Nr. K220541880 · GKV',
    rightActions: (
      <>
        <IconButton tooltip="Anrufen" size="sm" color="neutral" coloringStyle="text" onClick={action('onCall')}>
          <Phone/>
        </IconButton>
        <IconButton tooltip="Zu Kontakten hinzufügen" size="sm" color="neutral" coloringStyle="text" onClick={action('onAddContact')}>
          <UserRoundPlus/>
        </IconButton>
        <IconButton tooltip="Mehr" size="sm" color="neutral" coloringStyle="text">
          <EllipsisVertical/>
        </IconButton>
      </>
    ),
  },
  render: (args) => (
    <div className="w-150 max-w-full">
      <ChatThreadHeader {...args}/>
    </div>
  ),
}

export const withoutActions: Story = {
  args: {
    avatar: {
      name: 'Miriam Otte',
      status: 'offline',
    },
    title: 'Miriam Otte',
    subtitle: 'Hausarztpraxis Altstadt',
  },
  render: (args) => (
    <div className="w-150 max-w-full">
      <ChatThreadHeader {...args}/>
    </div>
  ),
}
