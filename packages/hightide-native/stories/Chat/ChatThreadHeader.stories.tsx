import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { Text, View } from 'react-native'
import { ChatThreadHeader } from '@/src/components/chat/ChatThreadHeader'
import { useTheme } from '@/src/global-contexts/theme'

const meta = {
  component: ChatThreadHeader,
} satisfies Meta<typeof ChatThreadHeader>

export default meta
type Story = StoryObj<typeof meta>

const AvatarPlaceholder = () => {
  const { theme } = useTheme()

  return (
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.semantic.primary,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: theme.semantic.onPrimary, fontWeight: '700' }}>AW</Text>
    </View>
  )
}

export const chatThreadHeader: Story = {
  args: {
    avatar: <AvatarPlaceholder />,
    title: 'Dr. Anna Wellermann',
    subtitle: 'Online',
  },
  render: (args) => (
    <View style={{ maxWidth: 420 }}>
      <ChatThreadHeader {...args} />
    </View>
  ),
}
