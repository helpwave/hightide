import type { Meta, StoryObj } from '@storybook/react-vite'
import { action } from 'storybook/actions'
import { useState } from 'react'
import { useControllableStateStore } from '@helpwave/hightide-utils/hooks'
import { TextInput, type TextInputState } from '../../../src/components/data-input/text/TextInput'

const meta = {
  component: TextInput,
  args: {
    isDisabled: false,
    isInvalid: false,
    isReadOnly: false,
    onValueChange: action('onValueChange'),
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
    const controlled = useControllableStateStore({
      state,
      onStateChange: (next) => {
        action('onStateChange')(next)
        setState(next)
      },
    })

    return (
      <TextInput.StateManager
        state={controlled.store}
        onStateChange={controlled.onStateChange}
        onStateEvent={args.onStateEvent}
        isInvalid={args.isInvalid}
        isDisabled={args.isDisabled}
        isReadOnly={args.isReadOnly}
        isRequired={args.isRequired}
      >
        <TextInput.Input {...args.inputProps} />
      </TextInput.StateManager>
    )
  },
}
