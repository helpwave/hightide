import type { Meta, StoryObj } from '@storybook/react'
import { RingWave } from '../../../src'

const meta = {
  title: 'Geometry/Ring',
  component: RingWave,
} satisfies Meta<typeof RingWave>

export default meta
type Story = StoryObj<typeof meta>;

export const ringWave: Story = {
  args: {
    startInnerSize: 20,
    endInnerSize: 50,
    width: 5,
    fillAnimationDuration: 3,
    repeating: false,
  },
}
