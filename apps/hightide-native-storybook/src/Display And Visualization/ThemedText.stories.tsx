import type {
  Meta,
  StoryObj
} from '@storybook/react-native'
import { View } from 'react-native'

import { ThemedText } from '@helpwave/hightide-native/components'

const textAppearances = ['normal', 'description'] as const

const meta = {
  component: ThemedText,
  argTypes: {
    appearance: {
      control: 'select',
      options: textAppearances,
    },
    children: {
      control: 'text',
    },
  },
} satisfies Meta<typeof ThemedText>

export default meta
type Story = StoryObj<typeof meta>

export const themedText: Story = {
  args: {
    appearance: 'normal',
    children: 'Themed text',
  },
  render: ({ appearance, children }) => (
    <View style={{ gap: 8 }}>
      <ThemedText appearance={appearance}>
        {children}
      </ThemedText>
    </View>
  ),
}
