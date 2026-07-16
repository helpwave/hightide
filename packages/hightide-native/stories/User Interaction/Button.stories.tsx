import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { action } from 'storybook/actions'
import { Button, ButtonUtil } from '@/src/components/Button/Button'

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
}
