import type { Meta, StoryObj } from '@storybook/nextjs'
import { Chip, ChipUtil } from '@/src/components/display-and-visualization/Chip'

const meta = {
  component: Chip,
  argTypes: {
    color: {
      control: 'select',
      options: ChipUtil.colors,
    }
  },
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>;

export const chip: Story = {
  args: {
    color: 'primary',
    coloringStyle: 'solid',
    size: 'md',
    children: 'Label',
  },
}
