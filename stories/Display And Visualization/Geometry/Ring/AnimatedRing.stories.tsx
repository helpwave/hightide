import type { Meta, StoryObj } from '@storybook/nextjs'
import { AnimatedRing } from '../../../../src/components/display-and-visualization/Ring'

const meta = {
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
