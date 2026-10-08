import type { Meta, StoryObj } from '@storybook/react-vite'
import { action } from 'storybook/actions'
import { useState } from 'react'
import { TextInput, type TextInputState } from '../../src/components/data-input/input/TextInput'

const meta = {
  component: TextInput,
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
