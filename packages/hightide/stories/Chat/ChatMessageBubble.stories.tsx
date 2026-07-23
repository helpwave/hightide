import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import type { ChatMessageDirection } from '../../src/components/chat/ChatMessageBubble'
import { ChatMessageBubble } from '../../src/components/chat/ChatMessageBubble'

const meta: Meta<typeof ChatMessageBubble> = {
  component: ChatMessageBubble,
  argTypes: {
    direction: {
      control: 'select',
      options: ['incoming', 'outgoing'] satisfies ChatMessageDirection[],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const chatMessageBubble: Story = {
  args: {
    direction: 'outgoing',
    timestamp: '09:24',
    readReceipt: 'Gelesen',
    children: 'Perfekt, ich habe den Befund erhalten. Bis Mittwoch!',
  },
  render: (args) => (
    <div className="flex-col-3 w-96 p-4 rounded-lg bg-background">
      <ChatMessageBubble direction="incoming" timestamp="09:12">
        Guten Tag Herr Wellermann, wir haben die Ergebnisse Ihrer Blutuntersuchung erhalten.
      </ChatMessageBubble>
      <ChatMessageBubble {...args}/>
    </div>
  ),
}
