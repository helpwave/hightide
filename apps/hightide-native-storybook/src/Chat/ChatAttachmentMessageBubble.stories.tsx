import { View } from 'react-native'
import type {
  Meta,
  StoryObj
} from '@storybook/react-native'
import { action } from 'storybook/actions'

import { ChatAttachmentMessageBubble } from '@helpwave/hightide-native/components'

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
    timestamp: '09:21',
    onDownload: action('download'),
  },
  render: (args) => (
    <View style={{ gap: 12, padding: 16 }}>
      <ChatAttachmentMessageBubble {...args} />
      <ChatAttachmentMessageBubble
        name="EKG_Bericht.pdf"
        metadata="PDF · 128 KB"
        direction="outgoing"
        timestamp="09:24"
        onDownload={action('download')}
      />
    </View>
  ),
}
