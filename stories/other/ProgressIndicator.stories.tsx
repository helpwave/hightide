import type { Meta, StoryObj } from '@storybook/nextjs'
import { ProgressIndicator } from '../../src'

const meta = {
  title: 'Other/Progress Indicator',
  component: ProgressIndicator,
} satisfies Meta<typeof ProgressIndicator>

export default meta
type Story = StoryObj<typeof meta>;

export const progressIndicator: Story = {
  args: {
    direction: 'clockwise',
    progress: 0.1,
    rotation: 0,
    size: 'medium',
  }
}
