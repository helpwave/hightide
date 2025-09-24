import type { Meta, StoryObj } from '@storybook/nextjs'
import { TextareaUncontrolled } from '../../src/components/user-action/Textarea'

const meta = {
  title: 'User Action',
  component: TextareaUncontrolled,
} satisfies Meta<typeof TextareaUncontrolled>

export default meta
type Story = StoryObj<typeof meta>;

export const textarea: Story = {
  args: {
    value: 'Text',
    disabled: false,
    invalid: false,
    className: '',
  },
}
