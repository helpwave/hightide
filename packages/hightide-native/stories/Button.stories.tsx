import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'
import { Button, coloringRoles, coloringStyles } from '../src'

const meta = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    color: { control: 'select', options: coloringRoles },
    coloringStyle: { control: 'select', options: coloringStyles },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Solid: Story = {
  args: { color: 'primary', coloringStyle: 'solid', size: 'md', children: 'Continue' },
}

export const Tonal: Story = {
  args: { color: 'primary', coloringStyle: 'tonal', size: 'md', children: 'Continue' },
}

export const Outline: Story = {
  args: { color: 'neutral', coloringStyle: 'outline', size: 'md', children: 'Cancel' },
}

export const Disabled: Story = {
  args: { color: 'primary', coloringStyle: 'solid', size: 'md', disabled: true, children: 'Disabled' },
}

export const AllTreatments: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
      {coloringStyles.map((coloringStyle) => (
        <Button key={coloringStyle} color="primary" coloringStyle={coloringStyle}>
          {coloringStyle}
        </Button>
      ))}
    </View>
  ),
}
