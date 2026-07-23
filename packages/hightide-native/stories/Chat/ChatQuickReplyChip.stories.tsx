import { View } from 'react-native'
import type {
  Meta,
  StoryObj
} from '@storybook/react-native-web-vite'
import { action } from 'storybook/actions'

import { ChatQuickReplyChip } from '../../src/components/chat/ChatQuickReplyChip'

const meta = {
  component: ChatQuickReplyChip,
} satisfies Meta<typeof ChatQuickReplyChip>

export default meta
type Story = StoryObj<typeof meta>

export const chatQuickReplyChip: Story = {
  args: {
    children: 'Termin bestätigen',
    isActive: false,
    onPress: action('press'),
  },
  render: (args) => (
    <View style={{ flexDirection: 'row', gap: 8, padding: 16 }}>
      <ChatQuickReplyChip {...args} />
      <ChatQuickReplyChip isActive onPress={action('active')}>
        Aktiv
      </ChatQuickReplyChip>
    </View>
  ),
}
