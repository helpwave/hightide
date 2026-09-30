import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { action } from 'storybook/actions'
import { ChatAttachmentMessageBubble } from '../../src/components/chat/ChatAttachmentMessageBubble'

const meta = {
  component: ChatAttachmentMessageBubble,
} satisfies Meta<typeof ChatAttachmentMessageBubble>

export default meta
type Story = StoryObj<typeof meta>

export const chatAttachmentMessageBubble: Story = {
  args: {
    name: 'Blutbild_2026-03.pdf',
    metadata: 'PDF · 245 KB',
    direction: 'incoming',
    timestamp: new Date(2026, 7, 24, 9, 24),
    downloadLabel: 'Herunterladen',
    onDownload: action('download'),
  },
  render: (args) => (
    <div className="flex-col-4">
      <ChatAttachmentMessageBubble {...args} />
      <ChatAttachmentMessageBubble
        name="EKG_Bericht.pdf"
        metadata="PDF · 128 KB"
        direction="outgoing"
        timestamp={new Date(2026, 7, 25, 9, 9)}
        onDownload={action('download')}
      />
    </div>
  ),
}
