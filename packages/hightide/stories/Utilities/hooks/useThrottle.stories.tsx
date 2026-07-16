import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { action } from 'storybook/actions'
import { useState } from 'react'

import { Button } from '@/src/components/user-interaction/Button'
import { Input } from '@/src/components/user-interaction/input/Input'
import { useThrottle } from '@/src/hooks/useThrottle'

type StoryArgs = {
  throttleMs: number,
}

const meta: Meta<StoryArgs> = {}

export default meta
type Story = StoryObj<typeof meta>

function ThrottleDemo({ throttleMs }: StoryArgs) {
  const [inputValue, setInputValue] = useState('')
  const [triggerCount, setTriggerCount] = useState(0)
  const [rawFiredCount, setRawFiredCount] = useState(0)
  const [throttledFiredCount, setThrottledFiredCount] = useState(0)
  const [lastRawValue, setLastRawValue] = useState('')
  const [lastThrottledValue, setLastThrottledValue] = useState('')

  const onThrottled = action('throttledCallback')
  const withThrottle = useThrottle(throttleMs)

  const scheduleThrottled = (value: string) => {
    setTriggerCount((count) => count + 1)
    setRawFiredCount((count) => count + 1)
    setLastRawValue(value)
    withThrottle(() => {
      setThrottledFiredCount((count) => count + 1)
      setLastThrottledValue(value)
      onThrottled(value)
    })
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)
    scheduleThrottled(value)
  }

  const handleClick = () => {
    const burstBase = triggerCount + 1
    setInputValue(`burst-${burstBase}`)
    scheduleThrottled(`burst-${burstBase}`)
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <Input
        value={inputValue}
        onValueChange={handleInputChange}
        placeholder="Type to trigger throttled updates"
      />
      <Button onClick={handleClick}>
        {'Click to Increase Trigger Count'}
      </Button>
      <div className="flex flex-col gap-2 text-sm">
        <span>{`Triggers: ${triggerCount}`}</span>
        <span>{`Raw fires: ${rawFiredCount}`}</span>
        <span>{`Throttled fires: ${throttledFiredCount}`}</span>
        <span>{`Last raw value: "${lastRawValue}"`}</span>
        <span>{`Last throttled value: "${lastThrottledValue}"`}</span>
      </div>
    </div>
  )
}

export const story: Story = {
  name: 'useThrottle',
  args: {
    throttleMs: 500,
  },
  render: (args) => <ThrottleDemo {...args} />,
}
