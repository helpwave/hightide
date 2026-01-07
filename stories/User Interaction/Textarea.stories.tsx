import type { Meta, StoryObj } from '@storybook/nextjs'
import { TextareaUncontrolled } from '@/src/components/user-interaction/Textarea'

const meta = {
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
