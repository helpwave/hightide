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
    position: 'bottom',
    containerClassName: '',
    tooltipClassName: '',
    children: (
      <span className="bg-primary text-white px-2 py-1 rounded-lg">{'Click to copy me'}</span>
    )
  },
}
