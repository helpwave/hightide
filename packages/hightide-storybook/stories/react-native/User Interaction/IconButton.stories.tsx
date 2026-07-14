import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { StorybookStyling } from '@storybook-helpers/styling'
import { IconButton } from '@helpwave/hightide-native'
import { action } from 'storybook/actions'
import { Text } from 'react-native'

const meta = {
  component: IconButton,
  argTypes: {
    color: {
      control: 'select',
      options: StorybookStyling.colors,
    },
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const iconButton: Story = {
  args: {
    disabled: false,
    color: 'primary',
    size: 'md',
    coloringStyle: 'solid',
    accessibilityLabel: 'Subtract',
    onPress: action('Pressed'),
    children: <Text style={{ fontSize: 16, fontWeight: '700' }}>−</Text>,
  },
  render: ({ children, ...props }) => {
    return (
      <IconButton {...props}>
        {children}
      </IconButton>
    )
  },
}
