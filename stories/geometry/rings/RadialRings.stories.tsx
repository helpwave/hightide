import type { Meta, StoryObj } from '@storybook/nextjs'
import { RadialRings } from '../../../src'

const meta = {
  title: 'Geometry/Ring',
  component: RadialRings,
} satisfies Meta<typeof RadialRings>

export default meta
type Story = StoryObj<typeof meta>;

export const radialRings: Story = {
  args: {
    waveWidth: 10,
    sizeCircle1: 100,
    sizeCircle2: 200,
    sizeCircle3: 300
  },
}
