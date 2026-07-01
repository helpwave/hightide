import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { Text, View } from 'react-native'
import { IconButton, coloringRoles, coloringStyles } from '../src'

/** Placeholder glyph so the stories don't depend on an icon library. */
const Glyph = ({ color, size }: { color: string, size: number }) => (
  <Text style={{ color, fontSize: size, fontWeight: '700' }}>＋</Text>
)

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  argTypes: {
    color: { control: 'select', options: coloringRoles },
    coloringStyle: { control: 'select', options: coloringStyles },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
  },
  args: {
    accessibilityLabel: 'Add item',
    icon: ({ color, size }: { color: string, size: number }) => <Glyph color={color} size={size} />,
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { color: 'neutral', coloringStyle: 'text', size: 'md' },
}

export const Solid: Story = {
  args: { color: 'primary', coloringStyle: 'solid', size: 'md' },
}

export const Sizes: Story = {
  render: (args) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
        <IconButton key={size} {...args} size={size} coloringStyle="tonal" color="primary" />
      ))}
    </View>
  ),
}
