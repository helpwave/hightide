import type { Meta, StoryObj } from '@storybook/nextjs'
import { Label } from '../../src/components/user-action/Label'

const meta = {
  title: 'User Action',
  component: Label,
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>;

export const label: Story = {
  args: {
    children: 'LabelText',
    size: 'md',
    className: '',
  },
}
