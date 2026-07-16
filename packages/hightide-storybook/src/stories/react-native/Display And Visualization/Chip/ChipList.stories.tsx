import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ChipList } from '@helpwave/hightide-native'

const meta = {
  component: ChipList,
} satisfies Meta<typeof ChipList>

export default meta
type Story = StoryObj<typeof meta>

export const chipList: Story = {
  args: {
    list: [
      { children: 'Chip 1' },
      { children: 'Chip 2' },
      { children: 'Chip 3 with longer text' },
      { children: 'Chip 4 different children' },
      { children: 'Chip 5 with text' },
      { children: 'Chip 6 negative', color: 'negative' },
      { children: 'Chip 7 in primary color', color: 'primary' },
      { children: 'Chip 8 with very very long text' },
    ],
  },
}
