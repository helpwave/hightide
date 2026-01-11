import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import { DateTimeInput } from '@/src/components/user-interaction/input/DateTimeInput'

const meta = {
  component: DateTimeInput,
} satisfies Meta<typeof DateTimeInput>

export default meta
type Story = StoryObj<typeof meta>;

export const dateTimeInput: Story = {
  args: {
    disabled: false,
    invalid: false,
    mode: 'date',
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
  },
}
