import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import { InputUncontrolled } from '../../../src/components/user-interaction/input/Input'

const meta = {
  component: InputUncontrolled,
} satisfies Meta<typeof InputUncontrolled>

export default meta
type Story = StoryObj<typeof meta>;

export const input: Story = {
  args: {
    value: '',
    disabled: false,
    invalid: false,
    placeholder: 'Placeholder',
    editCompleteOptions: {
      allowEnterComplete: true,
      onBlur: true,
      afterDelay: true,
      delay: 2500
    },
    onChange: action('onChange'),
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
  },
}
