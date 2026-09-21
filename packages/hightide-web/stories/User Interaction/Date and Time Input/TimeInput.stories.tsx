import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TimeInput } from '../../../src/components/user-interaction/date/TimeInput'
import { action } from 'storybook/actions'

const meta: Meta<typeof TimeInput> = {
  component: TimeInput,
}

export default meta
type Story = StoryObj<typeof meta>

export const timeInput: Story = {
  args: {
    initialValue: new Date('2026-07-02T14:35:00.000Z'),
    is24HourFormat: false,
    precision: 'minute',
    minuteIncrement: '1min',
    secondIncrement: '1s',
    millisecondIncrement: '100ms',
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
  },
}
