import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProgressIndicator } from '../../src/components/visualization/ProgressIndicator'

const meta = {
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
