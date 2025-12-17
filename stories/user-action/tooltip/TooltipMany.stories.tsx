import type { Meta, StoryObj } from '@storybook/nextjs'
import type { TooltipProps } from '../../../src/components/user-action/Tooltip'
import { Tooltip } from '../../../src/components/user-action/Tooltip'
import { range } from '../../../src'

type TooltipExampleProps = Omit<TooltipProps, 'children' | 'tooltip'> & { tooltipText: string }

const TooltipExample = ({ tooltipText, ...props }: TooltipExampleProps) => {
  return (
    <div className="flex-col-2 items-center">
      {range(10).map((index) => {
        return (
          <Tooltip key={index} tooltip={tooltipText + index} {...props}>
            <span className="bg-primary text-white px-2 py-1 rounded-lg">{'Hover over me '  + index}</span>
          </Tooltip>
        )
      })}
    </div>
  )
}

const meta = {
  title: 'User Action/Tooltip',
  component: TooltipExample,
} satisfies Meta<typeof TooltipExample>

export default meta
type Story = StoryObj<typeof meta>;

export const tooltipMany: Story = {
  args: {
    tooltipText: 'Tooltip',
    appearDelay: 500,
    disappearDelay: 50,
    position: 'bottom',
    containerClassName: '',
    tooltipClassName: ''
  },
}
