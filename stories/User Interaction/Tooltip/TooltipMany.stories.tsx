import type { Meta, StoryObj } from '@storybook/nextjs'
import { Tooltip } from '@/src/components/user-interaction/Tooltip'
import { range } from '@/src/utils/array'

const meta = {
  component: Tooltip,
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>;

export const tooltipMany: Story = {
  args: {
    tooltip: 'Tooltip',
    appearDelay: 500,
    disappearDelay: 50,
    position: 'bottom',
    containerClassName: '',
    tooltipClassName: ''
  },
  render: ({ tooltip, ...props }) => {
    return range(10).map((index) => {
      return (
        <Tooltip key={index} tooltip={tooltip + '-' + index} {...props}>
          <span className="bg-primary text-white px-2 py-1 rounded-lg">{'Hover over me '  + index}</span>
        </Tooltip>
      )
    })
  },
  decorators: (Story) => {
    return (
      <div className="flex-col-2 items-center">
        <Story/>
      </div>
    )
  }
}
