import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { action } from 'storybook/actions'

import { DateTimeWheelPicker } from '../../../src/components/data-input/date/DateTimeWheelPicker'

const meta = {
  component: DateTimeWheelPicker,
} satisfies Meta<typeof DateTimeWheelPicker>

export default meta
type Story = StoryObj<typeof meta>

export const dateTimeWheelPicker: Story = {
  args: {
    initialValue: new Date(),
    is24HourFormat: false,
    isLooping: true,
    loopingBehaviour: 'update',
    precision: 'minute',
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
  },
}
