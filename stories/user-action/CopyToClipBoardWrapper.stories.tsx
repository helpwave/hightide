import type { Meta, StoryObj } from '@storybook/nextjs'
import type { CopyToClipboardWrapperProps } from '../../src/components/user-action/CopyToClipboardWrapper'
import { CopyToClipboardWrapper } from '../../src/components/user-action/CopyToClipboardWrapper'

type CopyToClipboardWrapperExampleProps = Omit<CopyToClipboardWrapperProps, 'children' | 'textToCopy'>

const CopyToClipboardWrapperExample = ({ ...props }: CopyToClipboardWrapperExampleProps) => {
  return (
    <CopyToClipboardWrapper textToCopy="Click to copy me" {...props}>
      <span className="bg-primary text-white px-2 py-1 rounded-lg">{'Click to copy me'}</span>
    </CopyToClipboardWrapper>
  )
}

const meta = {
  title: 'User Action/Copy To Clipboard Wrapper',
  component: CopyToClipboardWrapperExample,
} satisfies Meta<typeof CopyToClipboardWrapperExample>

export default meta
type Story = StoryObj<typeof meta>;

export const copyToClipboardWrapper: Story = {
  args: {
    position: 'bottom',
    zIndex: 10,
    containerClassName: '',
    tooltipClassName: ''
  },
}
