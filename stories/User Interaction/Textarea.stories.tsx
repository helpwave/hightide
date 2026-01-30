import type { Meta, StoryObj } from '@storybook/nextjs'
import { Textarea } from '@/src/components/user-interaction/Textarea'

const meta = {
  component: Textarea,
} satisfies Meta<typeof Textarea>

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
