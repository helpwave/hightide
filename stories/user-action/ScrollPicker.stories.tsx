import type { Meta, StoryObj } from '@storybook/react'
import { range, ScrollPicker } from '../../src'

const meta = {
  title: 'User Action',
  component: ScrollPicker<number>,
} satisfies Meta<typeof ScrollPicker<number>>

export default meta
type Story = StoryObj<typeof meta>;

export const scrollPicker: Story = {
  args: {
    options: range(0, 59),
    mapping: (value) => value.toString(),
    selected: 55,
    disabled: false
  },
}
