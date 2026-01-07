import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import { DateTimeInputUncontrolled } from '@/src/components/user-interaction/input/DateTimeInput'

const meta = {
  component: DateTimeInputUncontrolled,
} satisfies Meta<typeof DateTimeInputUncontrolled>

export default meta
type Story = StoryObj<typeof meta>;

export const dateTimeInput: Story = {
  args: {
    date: undefined,
    disabled: false,
    invalid: false,
    mode: 'date',
    onRemove: action('onRemove'),
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
  },
}
