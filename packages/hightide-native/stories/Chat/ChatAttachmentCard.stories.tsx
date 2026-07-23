import { View } from 'react-native'
import type {
  Meta,
  StoryObj
} from '@storybook/react-native-web-vite'
import { action } from 'storybook/actions'

import { ChatAttachmentCard } from '../../src/components/chat/ChatAttachmentCard'

const meta = {
  component: ChatAttachmentCard,
} satisfies Meta<typeof ChatAttachmentCard>

export default meta
type Story = StoryObj<typeof meta>

export const chatAttachmentCard: Story = {
  args: {
    name: 'Blutbild_2026-03.pdf',
    metadata: 'PDF · 245 KB',
    direction: 'incoming',
    onDownload: action('download'),
  },
  render: (args) => (
    <View style={{ padding: 16 }}>
      <ChatAttachmentCard {...args} />
    </View>
  ),
}
