import type { Meta, StoryObj } from '@storybook/nextjs'
import { VerticalDivider } from '@/src/components/layout/VerticalDivider'

const meta = {
  component: VerticalDivider,
} satisfies Meta<typeof VerticalDivider>

export default meta
type Story = StoryObj<typeof meta>;

export const verticalDivider: Story = {
  args: {
    width: 3,
    height: 100,
    strokeWidth: 4,
    dashLength: 6,
    dashGap: 6,
  },
}
