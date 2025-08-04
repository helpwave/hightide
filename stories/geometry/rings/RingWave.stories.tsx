import type { Meta, StoryObj } from '@storybook/nextjs'
import { RingWave } from '@/src/components/icons-and-geometry/Ring'

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
