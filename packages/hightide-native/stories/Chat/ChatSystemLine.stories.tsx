import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'
import { ChatSystemLine } from '@/src/components/chat/ChatSystemLine'

const meta = {
  component: ChatSystemLine,
} satisfies Meta<typeof ChatSystemLine>

export default meta
type Story = StoryObj<typeof meta>

export const chatSystemLine: Story = {
  args: {
    children: 'Nachricht zugestellt',
  },
  render: (args) => (
    <View style={{ padding: 16 }}>
      <ChatSystemLine {...args} />
    </View>
  ),
}
