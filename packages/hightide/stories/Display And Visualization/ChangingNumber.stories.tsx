import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { ChangingNumber } from '../../src/components/display-and-visualization/ChangingNumber'
import { Button } from '../../src/components/user-interaction/Button'

const meta: Meta<typeof ChangingNumber> = {
  component: ChangingNumber,
}

export default meta
type Story = StoryObj<typeof meta>

export const changingNumber: Story = {
  args: {
    start: 0,
    end: 5000,
    animationTime: 1000,
    resetRateAfterUpdate: false,
  },
  render: ({ start, end: initialEnd, animationTime, resetRateAfterUpdate }) => {
    const [end, setEnd] = useState(initialEnd)

    return (
      <div className="flex-col-4 items-start">
        <span className="typography-title-lg">
          <ChangingNumber
            start={start}
            end={end}
            animationTime={animationTime}
            resetRateAfterUpdate={resetRateAfterUpdate}
          />
        </span>
        <div className="flex-row-2">
          <Button
            size="md"
            color="neutral"
            onClick={() => setEnd(currentEnd => currentEnd + 1000)}
          >
            +1000
          </Button>
          <Button
            size="md"
            color="neutral"
            onClick={() => setEnd(currentEnd => currentEnd - 1000)}
          >
            -1000
          </Button>
        </div>
      </div>
    )
  },
}
