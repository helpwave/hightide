import type { Meta, StoryObj } from '@storybook/react'
import { Label } from '../../src'

const meta = {
  title: 'User Action',
  component: Label,
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>;

export const label: Story = {
  args: {
    name: 'LabelText',
    labelType: 'labelMedium',
    className: '',
  },
}
