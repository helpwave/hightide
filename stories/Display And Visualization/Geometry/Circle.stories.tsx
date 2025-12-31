import type { Meta, StoryObj } from '@storybook/nextjs'
import { Circle } from '../../../src/components/display-and-visualization/Circle'

const meta = {
  component: Circle,
} satisfies Meta<typeof Circle>

export default meta
type Story = StoryObj<typeof meta>;

export const circle: Story = {
  args: {
    radius: 40,
  },
}
