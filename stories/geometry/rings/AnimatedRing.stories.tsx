import type { Meta, StoryObj } from '@storybook/react'
import { AnimatedRing } from '../../../src'

const meta = {
  title: 'Geometry/Ring',
  component: AnimatedRing,
} satisfies Meta<typeof AnimatedRing>

export default meta
type Story = StoryObj<typeof meta>;

export const animatedRing: Story = {
  args: {
    innerSize: 40,
    width: 10,
    fillAnimationDuration: 3,
  },
}
