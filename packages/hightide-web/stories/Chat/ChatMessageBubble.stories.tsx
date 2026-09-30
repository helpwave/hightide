import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  ChatMessageBubble,
  type ChatMessageDirection,
  type ChatMessageStatus
} from '../../src/components/chat/ChatMessageBubble'

const meta = {
  component: ChatMessageBubble,
  argTypes: {
    direction: {
      control: 'select',
      options: ['incoming', 'outgoing'] satisfies ChatMessageDirection[],
    },
    status: {
      control: 'select',
      options: ['sent', 'sending', 'received', 'read'] satisfies ChatMessageStatus[],
    },
  },
} satisfies Meta<typeof ChatMessageBubble>

export default meta
type Story = StoryObj<typeof meta>

export const chatMessageBubble: Story = {
  args: {
    direction: 'outgoing',
    timestamp: new Date(2026, 7, 24, 9, 24),
    status: 'read',
    children: 'Perfekt, ich habe den Befund erhalten. Bis Mittwoch!',
  },
  render: (args) => (
    <div className="flex-col-3 w-96 p-4 rounded-lg bg-background">
      <ChatMessageBubble direction="incoming" timestamp={new Date(2026, 7, 24, 9, 12)}>
        Guten Tag Herr Wellermann, wir haben die Ergebnisse Ihrer Blutuntersuchung erhalten.
      </ChatMessageBubble>
      <ChatMessageBubble {...args} />
    </div>
  ),
}
