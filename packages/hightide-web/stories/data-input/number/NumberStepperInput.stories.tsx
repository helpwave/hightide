import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import { NumberStepperInput } from '../../../src/components/data-input/number/NumberStepperInput'
import { action } from 'storybook/actions'

const meta: Meta<typeof NumberStepperInput> = {
  component: NumberStepperInput,
}

export default meta
type Story = StoryObj<typeof meta>

export const numberStepperInput: Story = {
  args: {
    initialValue: 5,
    minimum: 0,
    maximum: 1000,
    stepSize: 1,
    layout: 'row',
    isLooping: false,
    isDisabled: false,
    isReadOnly: false,
    isInvalid: false,
    onValueChange: action('onValueChange'),
    onStateEvent: action('onStateEvent'),
    onLooped: action('onLooped'),
  },
  render: ({ initialValue, ...props }) => {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])

    return (
      <NumberStepperInput
        {...props}
        value={value}
        onValueChange={(nextValue) => {
          props.onValueChange?.(nextValue)
          setValue(nextValue)
        }}
        onStateEvent={(event) => {
          props.onStateEvent?.(event)
          if (event.type === 'commit') setValue(event.value)
        }}
      />
    )
  },
}
