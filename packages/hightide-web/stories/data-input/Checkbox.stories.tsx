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
    onStateEvent: action('onStateEvent'),
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>;

export const uncontrolled: Story = {
  args: {
    initialValue: false,
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
      <Checkbox.StateManager
        state={state}
        onStateChange={(next) => {
          action('onStateChange')(next)
          setState(next)
        }}
        onStateEvent={args.onStateEvent}
        isInvalid={args.isInvalid}
        isDisabled={args.isDisabled}
        isReadOnly={args.isReadOnly}
        isRequired={args.isRequired}
      >
        <Checkbox.Trigger
          indeterminate={args.indeterminate}
          size={args.size}
          isRounded={args.isRounded}
        >
          <Checkbox.Icon
            indeterminate={args.indeterminate}
            size={args.size}
            alwaysShowCheckIcon={args.alwaysShowCheckIcon}
          />
        </Checkbox.Trigger>
      </Checkbox.StateManager>
    )
  },
}
