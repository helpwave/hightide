import { View } from 'react-native'
import type {
  Meta,
  StoryObj
} from '@storybook/react-native-web-vite'
import { action } from 'storybook/actions'

import { ChatMessageComposer } from '@/src/components/chat/ChatMessageComposer'

const meta = {
  component: ChatMessageComposer,
} satisfies Meta<typeof ChatMessageComposer>

export default meta
type Story = StoryObj<typeof meta>

export const chatMessageComposer: Story = {
  args: {
    placeholder: 'Nachricht …',
    onSend: action('send'),
  },
  render: (args) => (
    <View style={{ maxWidth: 420 }}>
      <ChatMessageComposer {...args} />
    </View>
  ),
}
