import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { action } from 'storybook/actions'
import { useState } from 'react'
import { Input, type InputState } from '../../src/components/data-input/input/Input'

const meta = {
  component: Input,
  args: {
    disabled: false,
    invalid: false,
    readOnly: false,
    placeholder: 'Placeholder',
    editCompleteOptions: {
      allowEnterComplete: true,
      onBlur: true,
      afterDelay: true,
      delay: 2500
    },
    onChange: action('onChange'),
    onValueUpdate: action('onValueUpdate'),
    onValueCommit: action('onValueCommit'),
    onStateChange: action('onStateChange'),
    onStateEvent: action('onStateEvent'),
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>;

export const input: Story = {
  args: {
    initialValue: '',
  },
}

export const controlledValue: Story = {
  render: function ControlledValue(args) {
    const [value, setValue] = useState('Controlled value')

    return (
      <Input
        {...args}
        value={value}
        onValueUpdate={(next) => {
          args.onValueUpdate?.(next)
          setValue(next)
        }}
      />
    )
  },
}

export const controlledState: Story = {
  render: function ControlledState(args) {
    const [state, setState] = useState<InputState>({ value: 'State value' })

    return (
      <Input
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
