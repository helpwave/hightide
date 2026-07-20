import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { action } from 'storybook/actions'
import { useState } from 'react'

import { Button } from '@/src/components/user-interaction/Button'
import { Input } from '@/src/components/user-interaction/input/Input'
import { useDebouncer } from '@helpwave/hightide-utils/hooks'

type StoryArgs = {
  debounceMs: number,
}

const meta: Meta<StoryArgs> = {}

export default meta
type Story = StoryObj<typeof meta>

function DebouncerDemo({ debounceMs }: StoryArgs) {
  const [inputValue, setInputValue] = useState('')
  const [triggerCount, setTriggerCount] = useState(0)
  const [firedCount, setFiredCount] = useState(0)
  const [debouncedValue, setDebouncedValue] = useState('')

  const onDebounced = action('debouncedCallback')
  const withDebounce = useDebouncer(debounceMs)

  const scheduleDebounced = (value: string) => {
    setTriggerCount((count) => count + 1)
    withDebounce(() => {
      setFiredCount((count) => count + 1)
      setDebouncedValue(value)
      onDebounced(value)
    })
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)
    scheduleDebounced(value)
  }

  const handleBurstClick = () => {
    const burstValue = `burst-${triggerCount + 1}`
    setInputValue(burstValue)
    scheduleDebounced(burstValue)
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <Input
        value={inputValue}
        onValueChange={handleInputChange}
        placeholder="Type to trigger debounced updates"
      />
      <Button onClick={handleBurstClick}>
        {'Rapid click burst'}
      </Button>
      <div className="flex flex-col gap-2 text-sm">
        <span>{`Triggers: ${triggerCount}`}</span>
        <span>{`Debounced fires: ${firedCount}`}</span>
        <span>{`Last debounced value: "${debouncedValue}"`}</span>
      </div>
    </div>
  )
}

export const story: Story = {
  name: 'useDebouncer',
  args: {
    debounceMs: 500,
  },
  render: (args) => <DebouncerDemo {...args} />,
}
