import type { Meta, StoryObj } from '@storybook/nextjs'
import { Ring } from '../../../src'

const meta = {
  title: 'Geometry/Ring',
  component: Ring,
} satisfies Meta<typeof Ring>

export default meta
type Story = StoryObj<typeof meta>;

export const ring: Story = {
  args: {
    innerSize: 40,
    width: 10,
  },
}
