import type { Meta, StoryObj } from '@storybook/nextjs'
import { Tooltip } from '@/src/components/user-interaction/Tooltip'

type StoryArgs = unknown


const meta: Meta<StoryArgs> = {
}

export default meta
type Story = StoryObj<typeof meta>;

export const tooltipStack: Story = {
  args: {
    animationDelay: 700,
    position: 'right',
    containerClassName: '',
    tooltipClassName: ''
  },
  render: () => {
    return (
      <Tooltip
        tooltip={(
          <Tooltip
            tooltip={(
              <span>Try to hover <Tooltip tooltip="Great right?">
                <span className="font-bold underline">here</span>
              </Tooltip></span>
            )}
          >
            This is a Text on which you can hover to show another Tooltip
          </Tooltip>
        )}
      >
        <span className="bg-primary text-white px-2 py-1 rounded-lg">Hover over me</span>
      </Tooltip>
    )
  }
}
