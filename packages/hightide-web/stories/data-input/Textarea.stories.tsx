import type { Meta, StoryObj } from '@storybook/react-vite'
import { action } from 'storybook/actions'
import { useState } from 'react'
import { Textarea, type TextareaState } from '../../src/components/data-input/Textarea'

const meta = {
  component: Textarea,
  args: {
    isDisabled: false,
    isInvalid: false,
    isReadOnly: false,
    onValueChange: action('onValueChange'),
    onStateEvent: action('onStateEvent'),
    inputProps: {
      className: 'w-full',
      placeholder: 'Placeholder',
    },
  },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>;

export const textarea: Story = {
  args: {
    initialValue: 'Text',
  },
}

export const uncontrolled: Story = {
  args: {
    initialValue: 'Text',
  },
}

export const controlledValue: Story = {
  render: function ControlledValue(args) {
    const [value, setValue] = useState('Controlled value')

    return (
      <Textarea
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
    const [state, setState] = useState<TextareaState>({ value: 'State value' })

    return (
      <Textarea.StateManager
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
        <Textarea.Input {...args.inputProps} />
      </Textarea.StateManager>
    )
  },
}
