import type { Meta, StoryObj } from '@storybook/nextjs'
import { Tooltip } from '@/src/components/user-interaction/Tooltip'
import { range } from '@/src/utils/array'
import { Button } from '@/src/components/user-interaction/Button'

const meta = {
  component: Tooltip,
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>;

export const tooltipMany: Story = {
  args: {
    tooltip: 'Tooltip',
    position: 'bottom',
    appearDelay: undefined,
    containerClassName: '',
    tooltipClassName: '',
  },
  render: ({ tooltip, ...props }) => {
    return (
      <>
        {range(10).map((index) => {
          return (
            <Tooltip key={index} tooltip={tooltip + '-' + index} {...props}>
              <span className="bg-primary text-white px-2 py-1 rounded-lg">{'Hover over me ' + index}</span>
            </Tooltip>
          )
        })}
        <Tooltip tooltip={tooltip} {...props}>
          <Button className="bg-primary text-white px-2 py-1 rounded-lg">Tab to me</Button>
        </Tooltip>
      </>
    )
  },
  decorators: (Story) => {
    return (
      <div className="flex-col-2 items-center">
        <Story/>
      </div>
    )
  }
}
