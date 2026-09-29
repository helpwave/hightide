import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { action } from 'storybook/actions'

import { TimeWheelPicker } from '../../../src/components/user-interaction/date/TimeWheelPicker'

const meta = {
  component: TimeWheelPicker,
} satisfies Meta<typeof TimeWheelPicker>

export default meta
type Story = StoryObj<typeof meta>

export const timeWheelPicker: Story = {
  args: {
    initialValue: new Date('2026-07-02T14:35:00.000Z'),
    is24HourFormat: false,
    isLooping: true,
    loopingBehaviour: 'update',
    precision: 'minute',
    minuteIncrement: '1min',
    secondIncrement: '1s',
    millisecondIncrement: '100ms',
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
  },
}
