import type { Meta, StoryObj } from '@storybook/react'
import { Chip } from '../../../src'

const meta = {
  title: 'Layout/Chip',
  component: Chip,
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
