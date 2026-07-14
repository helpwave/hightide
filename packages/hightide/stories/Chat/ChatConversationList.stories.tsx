import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { action } from 'storybook/actions'
import { ChatConversationList } from '@/src/components/chat/ChatConversationList'
import { ChatConversationRow } from '@/src/components/chat/ChatConversationRow'
import { IconButton } from '@/src/components/user-interaction/IconButton'
import { Plus } from 'lucide-react'
import clsx from 'clsx'

const meta: Meta<typeof ChatConversationList> = {
  component: ChatConversationList,
}

export default meta
type Story = StoryObj<typeof meta>

export const chatConversationListWithHeader: Story = {
  args: {
    header: (
      <div className="flex-row-4 w-full items-center justify-between">
        <span className="text-primary font-semibold">{'Chats'}</span>
        <IconButton
          tooltip="New Chat"
          size="sm"
          coloringStyle="text"
        >
          <Plus className="size-5"/>
        </IconButton>
      </div>
    ),
    footer: (
      <div className="flex-row-4 w-full items-center justify-between">
        <span className="text-description">{'5 Chats'}</span>
      </div>
    )
  },
  render: (args) => (
    <ChatConversationList {...args} className={clsx('h-90 w-90 border border-divider overflow-hidden', args.className)}>
      <ChatConversationRow
        avatar={{ name: 'Jonas Wellermann', status: 'online' }}
        title="Jonas Wellermann"
        timestamp="14:22"
        preview="Perfekt, ich habe den Befund erhalten."
        unreadCount={2}
        onClick={action('onClick')}
      />
      <ChatConversationRow
        avatar={{ name: 'Miriam Otte', status: 'offline' }}
        title="Miriam Otte"
        timestamp="Gestern"
        preview="Vielen Dank für die schnelle Rückmeldung."
        sentIndicator="sent"
        isSelected={true}
        onClick={action('onClick')}
      />
      <ChatConversationRow
        avatar={{ name: 'Bernd Hagen', status: 'offline' }}
        title="Bernd Hagen"
        timestamp="Mo."
        preview="Das Rezept ist unterwegs."
        onClick={action('onClick')}
      />
      <ChatConversationRow
        avatar={{ name: 'Max Mustermann', status: 'online' }}
        title="Max Mustermann"
        timestamp="Mo."
        preview="Das Rezept ist unterwegs."
        onClick={action('onClick')}
      />
      <ChatConversationRow
        avatar={{ name: 'Maxine Mustermann', status: 'offline' }}
        title="Maxine Mustermann"
        timestamp="Mo."
        preview="Das Rezept ist unterwegs."
        onClick={action('onClick')}
      />
    </ChatConversationList>
  ),
}

export const minimal: Story = {
  args: {},
  render: (args) => (
    <ChatConversationList {...args} className={clsx('h-80 w-90 rounded-lg border border-divider overflow-hidden', args.className)}>
      <ChatConversationRow
        avatar={{ name: 'Jonas Wellermann', status: 'online' }}
        title="Jonas Wellermann"
        timestamp="14:22"
        preview="Perfekt, ich habe den Befund erhalten."
        unreadCount={2}
        onClick={action('onClick')}
      />
      <ChatConversationRow
        avatar={{ name: 'Miriam Otte', status: 'offline' }}
        title="Miriam Otte"
        timestamp="Gestern"
        preview="Vielen Dank für die schnelle Rückmeldung."
        sentIndicator="sent"
        isSelected={true}
        onClick={action('onClick')}
      />
      <ChatConversationRow
        avatar={{ name: 'Bernd Hagen', status: 'offline' }}
        title="Bernd Hagen"
        timestamp="Mo."
        preview="Das Rezept ist unterwegs."
        onClick={action('onClick')}
      />
      <ChatConversationRow
        avatar={{ name: 'Max Mustermann', status: 'online' }}
        title="Max Mustermann"
        timestamp="Mo."
        preview="Das Rezept ist unterwegs."
        onClick={action('onClick')}
      />
      <ChatConversationRow
        avatar={{ name: 'Maxine Mustermann', status: 'offline' }}
        title="Maxine Mustermann"
        timestamp="Mo."
        preview="Das Rezept ist unterwegs."
        onClick={action('onClick')}
      />
    </ChatConversationList>
  ),
}
