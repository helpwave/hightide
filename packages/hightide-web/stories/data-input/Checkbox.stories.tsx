import type { Meta, StoryObj } from '@storybook/react-vite'
import { action } from 'storybook/actions'
import { useState } from 'react'
import { Checkbox, type CheckboxState } from '../../src/components/data-input/Checkbox'

const meta = {
  component: Checkbox,
  args: {
    indeterminate: false,
    isDisabled: false,
    isInvalid: false,
    isRounded: false,
    size: 'md',
    alwaysShowCheckIcon: false,
    onValueChange: action('onValueChange'),
    onStateChange: action('onStateChange'),
    onStateEvent: action('onStateEvent'),
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>;

export const uncontrolled: Story = {
  args: {
    initialState: { value: false },
  },
}

export const controlledValue: Story = {
  render: function ControlledValue(args) {
    const [value, setValue] = useState(false)

    return (
      <Checkbox
        {...args}
        value={value}
        onValueChange={(next) => {
          args.onValueChange?.(next)
          setValue(next)
        }}
      />
    )
  },
}

export const controlledState: Story = {
  render: function ControlledState(args) {
    const [state, setState] = useState<CheckboxState>({ value: false })

    return (
      <Checkbox
        {...args}
        value={undefined}
        state={state}
        onStateChange={(next) => {
          args.onStateChange?.(next)
          setState(next)
        }}
      />
    )
  },
}
