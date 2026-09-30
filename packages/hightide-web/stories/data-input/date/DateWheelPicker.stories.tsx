import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { action } from 'storybook/actions'
import { DateUtils } from '@helpwave/hightide-utils/utils'

import { DateWheelPicker } from '../../../src/components/data-input/date/DateWheelPicker'

const meta = {
  component: DateWheelPicker,
} satisfies Meta<typeof DateWheelPicker>

export default meta
type Story = StoryObj<typeof meta>

export const dateWheelPicker: Story = {
  args: {
    initialValue: new Date(),
    start: DateUtils.subtractDuration(new Date(), { years: 50 }),
    end: DateUtils.addDuration(new Date(), { years: 50 }),
    isLooping: true,
    loopingBehaviour: 'update',
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
  },
}
