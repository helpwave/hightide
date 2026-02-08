import type { Meta, StoryObj } from '@storybook/nextjs'
import { CopyToClipboardWrapper } from '@/src/components/user-interaction/CopyToClipboardWrapper'

const meta = {
  component: CopyToClipboardWrapper,
} satisfies Meta<typeof CopyToClipboardWrapper>

export default meta
type Story = StoryObj<typeof meta>;

export const copyToClipboardWrapper: Story = {
  args: {
    textToCopy: 'Click to copy me',
    alignment: 'bottom',
    containerClassName: 'bg-primary text-white px-2 py-1 rounded-lg',
    children: 'Click to copy me',
  },
}
