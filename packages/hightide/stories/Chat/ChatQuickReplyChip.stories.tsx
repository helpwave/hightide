import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { action } from 'storybook/actions'
import { ChatQuickReplyChip } from '@/src/components/chat/ChatQuickReplyChip'

const meta: Meta<typeof ChatQuickReplyChip> = {
  component: ChatQuickReplyChip,
}

export default meta
type Story = StoryObj<typeof meta>

export const chatQuickReplyChip: Story = {
  args: {
    isActive: true,
    children: 'Termin bestätigen',
    onClick: action('onClick'),
  },
  render: (args) => (
    <div className="flex-row-1 gap-1 flex-wrap">
      <ChatQuickReplyChip {...args}/>
      <ChatQuickReplyChip onClick={action('onClick')}>Rezept ausstellen</ChatQuickReplyChip>
      <ChatQuickReplyChip onClick={action('onClick')}>Überweisung senden</ChatQuickReplyChip>
    </div>
  ),
}
