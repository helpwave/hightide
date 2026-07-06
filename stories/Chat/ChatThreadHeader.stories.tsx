import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { EllipsisVertical, Phone, UserRound } from 'lucide-react'
import { ChatThreadHeader } from '@/src/components/chat/ChatThreadHeader'
import { IconButton } from '@/src/components/user-interaction/IconButton'

const meta: Meta<typeof ChatThreadHeader> = {
  component: ChatThreadHeader,
}

export default meta
type Story = StoryObj<typeof meta>

export const chatThreadHeader: Story = {
  args: {
    avatar: {
      name: 'Jonas Wellermann',
      status: 'online',
    },
    title: 'Jonas Wellermann',
    subtitle: 'geb. 14.03.1982 · Vers.-Nr. K220541880 · GKV',
  },
  render: (args) => (
    <div className="w-150 max-w-full">
      <ChatThreadHeader
        {...args}
        trailing={(
          <>
            <IconButton tooltip="Anrufen" size="sm" color="neutral" coloringStyle="text">
              <Phone/>
            </IconButton>
            <IconButton tooltip="Patientenakte" size="sm" color="neutral" coloringStyle="text">
              <UserRound/>
            </IconButton>
            <IconButton tooltip="Mehr" size="sm" color="neutral" coloringStyle="text">
              <EllipsisVertical/>
            </IconButton>
          </>
        )}
      />
    </div>
  ),
}
