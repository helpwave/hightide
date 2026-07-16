import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { action } from 'storybook/actions'
import { ChatAttachmentCard } from '@/src/components/chat/ChatAttachmentCard'

const meta: Meta<typeof ChatAttachmentCard> = {
  component: ChatAttachmentCard,
}

export default meta
type Story = StoryObj<typeof meta>

export const chatAttachmentCard: Story = {
  args: {
    name: 'Befund_Blutbild.pdf',
    metadata: 'PDF · 196 KB · 09:21',
    direction: 'incoming',
    downloadLabel: 'Herunterladen',
    onDownload: action('onDownload'),
  },
}
