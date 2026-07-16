import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { Chip, ChipUtil } from '@/src/components/Chip/Chip'

const meta = {
  component: Chip,
  argTypes: {
    color: {
      control: 'select',
      options: ChipUtil.colors,
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
