import { View } from 'react-native'
import type {
  Meta,
  StoryObj
} from '@storybook/react'

import { ChatDateDivider } from '@helpwave/hightide-native/components'

const meta = {
  component: ChatDateDivider,
} satisfies Meta<typeof ChatDateDivider>

export default meta
type Story = StoryObj<typeof meta>

export const chatDateDivider: Story = {
  args: {
    children: 'Heute',
  },
  render: (args) => (
    <View style={{ padding: 16 }}>
      <ChatDateDivider {...args} />
    </View>
  ),
}
