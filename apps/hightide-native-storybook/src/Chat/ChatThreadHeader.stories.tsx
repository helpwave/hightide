import { View } from 'react-native'
import type {
  Meta,
  StoryObj
} from '@storybook/react-native'

import { ChatThreadHeader } from '@helpwave/hightide-native/components'

const meta = {
  component: ChatThreadHeader,
} satisfies Meta<typeof ChatThreadHeader>

export default meta
type Story = StoryObj<typeof meta>

export const chatThreadHeader: Story = {
  args: {
    avatar: {
      name: 'Anna Wellermann',
    },
    title: 'Dr. Anna Wellermann',
    subtitle: 'Online',
  },
  render: (args) => (
    <View style={{ maxWidth: 420 }}>
      <ChatThreadHeader {...args} />
    </View>
  ),
}
