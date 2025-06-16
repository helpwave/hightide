import type { Meta, StoryObj } from '@storybook/nextjs'
import type { TooltipProps } from '../../../src'
import { Tooltip } from '../../../src'

type TooltipExampleProps = Omit<TooltipProps, 'children' | 'tooltip'> & { tooltipText: string }

const TooltipExample = ({ tooltipText, ...props }: TooltipExampleProps) => {
  return (
    <Tooltip tooltip={tooltipText} {...props}><span
      className="bg-primary text-white px-2 py-1 rounded-lg">Hover over me</span></Tooltip>
  )
}

const meta = {
  title: 'User Action/Tooltip',
  component: TooltipExample,
} satisfies Meta<typeof TooltipExample>

export default meta
type Story = StoryObj<typeof meta>;

export const tooltip: Story = {
  args: {
    tooltipText: 'Tooltip',
    animationDelay: 700,
    position: 'bottom',
    zIndex: 10,
    containerClassName: '',
    tooltipClassName: ''
  },
}
