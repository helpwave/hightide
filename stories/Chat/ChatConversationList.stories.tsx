import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { action } from 'storybook/actions'
import { ChatConversationList } from '@/src/components/chat/ChatConversationList'
import { ChatConversationRow } from '@/src/components/chat/ChatConversationRow'

const meta: Meta<typeof ChatConversationList> = {
  component: ChatConversationList,
}

export default meta
type Story = StoryObj<typeof meta>

export const chatConversationList: Story = {
  args: {
    title: 'Chats',
    createLabel: 'Neuer Chat',
    hasSearch: true,
    searchPlaceholder: 'Patient oder Nachricht suchen',
    onCreate: action('onCreate'),
    onSearch: action('onSearch'),
  },
  render: (args) => (
    <div className="h-120 w-90 rounded-lg border border-divider overflow-hidden">
      <ChatConversationList {...args}>
        <ChatConversationRow
          avatar={{ name: 'Jonas Wellermann', status: 'online' }}
          title="Jonas Wellermann"
          timestamp="14:22"
          preview="Perfekt, ich habe den Befund erhalten."
          unreadCount={2}
          isUnread={true}
          onClick={action('onClick')}
        />
        <ChatConversationRow
          avatar={{ name: 'Miriam Otte', status: 'offline' }}
          title="Miriam Otte"
          timestamp="Gestern"
          preview="Vielen Dank für die schnelle Rückmeldung."
          hasSentIndicator={true}
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
      </ChatConversationList>
    </div>
  ),
}

export const minimal: Story = {
  args: {},
  render: (args) => (
    <div className="h-80 w-90 rounded-lg border border-divider overflow-hidden">
      <ChatConversationList {...args}>
        <ChatConversationRow
          avatar={{ name: 'Jonas Wellermann', status: 'online' }}
          title="Jonas Wellermann"
          timestamp="14:22"
          preview="Perfekt, ich habe den Befund erhalten."
          onClick={action('onClick')}
        />
      </ChatConversationList>
    </div>
  ),
}
