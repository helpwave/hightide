import type { Meta, StoryObj } from '@storybook/nextjs'
import { Circle } from '../../src'

const meta = {
  title: 'Geometry/Circle',
  component: Circle,
} satisfies Meta<typeof Circle>

export default meta
type Story = StoryObj<typeof meta>;

export const circle: Story = {
  args: {
    radius: 40,
  },
}
