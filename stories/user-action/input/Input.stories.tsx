import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import { InputUncontrolled } from '../../../src/components/user-action/input/Input'

const meta = {
  title: 'User Action/Input',
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
    onChangeText: action('onChangeText'),
    onEditCompleted: action('onEditCompleted'),
  },
}
