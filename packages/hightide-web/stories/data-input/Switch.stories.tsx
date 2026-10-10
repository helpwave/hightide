import type { Meta, StoryObj } from '@storybook/react-vite'
import { action } from 'storybook/actions'
import { useState } from 'react'
import { Switch as SwitchComponent, type SwitchState } from '../../src/components/data-input/Switch'

const meta = {
  component: SwitchComponent,
  args: {
    isDisabled: false,
    isInvalid: false,
    isReadOnly: false,
    onValueChange: action('onValueChange'),
    onStateEvent: action('onStateEvent'),
  },
} satisfies Meta<typeof SwitchComponent>

export default meta
type Story = StoryObj<typeof meta>;

export const Switch: Story = {
  args: {
    initialValue: true,
  },
}

export const uncontrolled: Story = {
  args: {
    initialValue: true,
  },
}

export const controlledValue: Story = {
  render: function ControlledValue(args) {
    const [value, setValue] = useState(true)

    return (
      <SwitchComponent
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
    const [state, setState] = useState<SwitchState>({ value: true })

    return (
      <SwitchComponent.StateManager
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
        <SwitchComponent.Trigger>
          <SwitchComponent.Track>
            <SwitchComponent.Thumb />
          </SwitchComponent.Track>
        </SwitchComponent.Trigger>
      </SwitchComponent.StateManager>
    )
  },
}
