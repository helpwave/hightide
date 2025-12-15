import type { Meta, StoryObj } from '@storybook/nextjs'
import { ChipList } from '../../../src/components/layout/Chip'

const meta = {
  title: 'Layout/Chip',
  component: ChipList,
} satisfies Meta<typeof ChipList>

export default meta
type Story = StoryObj<typeof meta>;

export const chipList: Story = {
  args: {
    list: [
      { children: 'Chip 1' },
      { children: 'Chip 2' },
      { children: 'Chip 3 with longer text' },
      { children: 'Chip 4 different children', variant: 'fullyRounded' },
      { children: 'Chip 5 with text' },
      { children: 'Chip 6 custom style', className: 'bg-negative' },
      { children: 'Chip 7 in dark color', color: 'primary' },
      { children: 'Chip 8 with very very long text' },
      { children: 'Chip 9' },
    ],
    className: ''
  },
}
