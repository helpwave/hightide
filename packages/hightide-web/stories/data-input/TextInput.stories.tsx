import type { Meta, StoryObj } from '@storybook/react-vite'
import { action } from 'storybook/actions'
import { useState } from 'react'
import { TextInput, type TextInputState } from '../../src/components/data-input/input/TextInput'

const meta = {
  component: TextInput,
  args: {
    isDisabled: false,
    isInvalid: false,
    isReadOnly: false,
    onValueChange: action('onValueChange'),
    onStateChange: action('onStateChange'),
    onStateEvent: action('onStateEvent'),
    inputProps: {
      placeholder: 'Placeholder',
      onChange: action('onChange'),
    },
  },
} satisfies Meta<typeof TextInput>

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
      <TextInput
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
    const [state, setState] = useState<TextInputState>({ value: 'State value' })

    return (
      <TextInput
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
