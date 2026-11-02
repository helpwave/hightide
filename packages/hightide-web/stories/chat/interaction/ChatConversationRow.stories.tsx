import type { Meta, StoryObj } from '@storybook/react-vite'
import { action } from 'storybook/actions'
import { ChatConversationRow } from '../../../src/components/chat/interaction/ChatConversationRow'

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
        sentIndicator="sent"
        isSelected={true}
        onClick={action('onClick')}
      />
      <ChatConversationRow
        avatar={{ name: 'Bernd Hagen', status: 'offline' }}
        title="Bernd Hagen"
        timestamp="Mo."
        preview="Das Rezept ist unterwegs."
        sentIndicator="sentAndReceived"
        onClick={action('onClick')}
      />
    </div>
  ),
}

export const composed: Story = {
  args: {
    avatar: {
      name: 'Jonas Wellermann',
      status: 'online',
    },
    title: 'Jonas Wellermann',
    timestamp: '14:22',
    preview: 'Perfekt, ich habe den Befund erhalten.',
    unreadCount: 2,
    isSelected: false,
    sentIndicator: 'sent',
    onClick: action('onClick'),
  },
  render: (args) => {
    const isUnread = (args.unreadCount ?? 0) > 0

    return (
      <div className="flex-col-0 w-90 rounded-lg bg-surface overflow-hidden">
        <ChatConversationRow.Provider
          value={{
            isSelected: args.isSelected ?? false,
            unreadCount: args.unreadCount,
            isUnread,
            sentIndicator: args.sentIndicator,
          }}
        >
          <ChatConversationRow.Layout
            {...args.layoutProps}
            onClick={args.onClick}
            leading={<ChatConversationRow.Avatar {...args.avatar} {...args.avatarProps}/>}
            content={(
              <ChatConversationRow.Content {...args.contentProps}>
                <ChatConversationRow.Header {...args.headerProps}>
                  <ChatConversationRow.Title {...args.titleProps}>{args.title}</ChatConversationRow.Title>
                  <ChatConversationRow.Timestamp {...args.timestampProps}>{args.timestamp}</ChatConversationRow.Timestamp>
                </ChatConversationRow.Header>
                <ChatConversationRow.Body {...args.bodyProps}>
                  <ChatConversationRow.Preview {...args.previewProps}>
                    <ChatConversationRow.SentIndicator {...args.sentIndicatorProps}/>
                    <span className="chat-conversation-row-preview-text">{args.preview}</span>
                  </ChatConversationRow.Preview>
                  <ChatConversationRow.UnreadCount {...args.unreadCountProps}/>
                </ChatConversationRow.Body>
              </ChatConversationRow.Content>
            )}
          />
        </ChatConversationRow.Provider>
      </div>
    )
  },
}
