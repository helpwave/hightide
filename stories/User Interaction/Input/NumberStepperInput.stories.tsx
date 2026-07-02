import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useEffect, useState } from 'react'
import { NumberStepperInput } from '@/src/components/user-interaction/input/NumberStepperInput'
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
    step: 1,
    layout: 'row',
    looping: false,
    disabled: false,
    readOnly: false,
    invalid: false,
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
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
        onEditComplete={(nextValue) => {
          props.onEditComplete?.(nextValue)
          setValue(nextValue)
        }}
      />
    )
  },
}
