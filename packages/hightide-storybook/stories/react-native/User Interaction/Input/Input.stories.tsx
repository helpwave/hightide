import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Input } from '@helpwave/hightide-native'
import { action } from 'storybook/actions'

const meta = {
  component: Input,
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const input: Story = {
  args: {
    initialValue: '',
    disabled: false,
    invalid: false,
    placeholder: 'Placeholder',
    editCompleteOptions: {
      allowEnterComplete: true,
      onBlur: true,
      afterDelay: true,
      delay: 2500,
    },
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
  },
}
