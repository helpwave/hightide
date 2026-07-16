import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button, ButtonUtil } from '@helpwave/hightide-native'
import { action } from 'storybook/actions'

const meta = {
  component: Button,
  argTypes: {
    color: {
      control: 'select',
      options: ButtonUtil.colors,
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const button: Story = {
  args: {
    children: 'Test',
    disabled: false,
    color: 'primary',
    size: 'md',
    coloringStyle: 'solid',
    onPress: action('Pressed'),
  },
  render: ({ children, ...props }) => {
    return (
      <Button {...props}>
        {children}
      </Button>
    )
  },
}
