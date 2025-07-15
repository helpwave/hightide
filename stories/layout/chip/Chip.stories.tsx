import type { Meta, StoryObj } from '@storybook/nextjs'
import { Chip, ChipUtil } from '../../../src'

const meta = {
  title: 'Layout/Chip',
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
    children: 'Label',
    className: '',
    variant: 'normal',
    color: 'default'
  },
}
