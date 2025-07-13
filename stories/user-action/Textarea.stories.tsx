import type { Meta, StoryObj } from '@storybook/nextjs'
import { TextareaUncontrolled } from '../../src'

const meta = {
  title: 'User Action',
  component: TextareaUncontrolled,
} satisfies Meta<typeof TextareaUncontrolled>

export default meta
type Story = StoryObj<typeof meta>;

export const textarea: Story = {
  args: {
    value: 'Text',
    label: { name: 'Label' },
    disabled: false,
    headline: '',
    disclaimer: '',
    resizable: false,
    className: '',
  },
}
