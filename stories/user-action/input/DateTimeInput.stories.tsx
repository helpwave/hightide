import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import { DateTimeInputUncontrolled } from '../../../src/components/user-action/input/DateTimeInput'

const date = new Date()

const meta = {
  title: 'User Action/Input',
  component: DateTimeInputUncontrolled,
} satisfies Meta<typeof DateTimeInputUncontrolled>

export default meta
type Story = StoryObj<typeof meta>;

export const dateTimeInput: Story = {
  args: {
    date,
    disabled: false,
    invalid: false,
    mode: 'date',
    onRemove: action('onRemove'),
    onValueChange: action('onValueChange'),
    onEditCompleted: action('onEditCompleted'),
  },
}
