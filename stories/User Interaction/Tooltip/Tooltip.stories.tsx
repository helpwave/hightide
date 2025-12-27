import type { Meta, StoryObj } from '@storybook/nextjs'
import { Tooltip } from '../../../src/components/user-interaction/Tooltip'

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
}

export default meta
type Story = StoryObj<typeof meta>;

export const tooltip: Story = {
  args: {
    tooltip: 'Tooltip',
    appearDelay: 500,
    disappearDelay: 500,
    position: 'bottom',
    containerClassName: '',
    tooltipClassName: ''
  },
  decorators: (Story) => {
    return (
      <div className="flex-col-2 items-center justify-center min-h-64">
        <Story />
      </div>
    )
  },
  render: ({ ...props }) => {
    return (
      <Tooltip {...props}>
        <span className="bg-primary text-white px-2 py-1 rounded-lg">Hover over me</span>
      </Tooltip>
    )
  }
}
