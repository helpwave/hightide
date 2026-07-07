import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { action } from 'storybook/actions'
import { ChatConversationRow } from '@/src/components/chat/ChatConversationRow'

const meta: Meta<typeof ChatConversationRow> = {
  component: ChatConversationRow,
}

export default meta
type Story = StoryObj<typeof meta>

export const chatConversationRow: Story = {
  args: {
    avatar: {
      name: 'Jonas Wellermann',
      status: 'online',
      image: {
        avatarUrl: 'https://cdn.helpwave.de/test-avatar.svg',
        alt: 'profile picture',
      },
    },
    title: 'Jonas Wellermann',
    timestamp: '14:22',
    preview: 'Perfekt, ich habe den Befund erhalten. Bis Mittwoch!',
    unreadCount: 2,
    isSelected: false,
    isUnread: true,
    hasSentIndicator: false,
    onClick: action('onClick'),
  },
  render: (args) => (
    <div className="flex-col-0 w-90 rounded-lg bg-surface overflow-hidden">
      <ChatConversationRow {...args}/>
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
    </div>
  ),
}
