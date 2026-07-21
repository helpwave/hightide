import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { Chip, ChipUtil } from '@/src/components/visualization-and-display/Chip'

const meta = {
  component: Chip,
  argTypes: {
    color: {
      control: 'select',
      options: ChipUtil.colors,
    },
    size: {
      control: 'select',
      options: ChipUtil.sizes,
    },
    coloringStyle: {
      control: 'select',
      options: ChipUtil.coloringStyles,
    },
  },
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

export const chip: Story = {
  args: {
    color: 'primary',
    coloringStyle: 'solid',
    size: 'md',
    children: 'Label',
  },
}
