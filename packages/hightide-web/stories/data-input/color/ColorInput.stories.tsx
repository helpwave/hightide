import type { Meta, StoryObj } from '@storybook/react-vite'
import { action } from 'storybook/actions'
import { useState } from 'react'
import { ColorInput } from '../../../src/components/data-input/color/ColorInput'
import type { HexColor } from '../../../src/components/data-input/color/ColorInput'

const meta = {
  component: ColorInput,
  args: {
    hasAlpha: false,
    isCapitalized: false,
    isDisabled: false,
    isInvalid: false,
    isReadOnly: false,
    onValueChange: action('onValueChange'),
    onStateEvent: action('onStateEvent'),
    inputProps: {
      placeholder: '#000000',
    },
  },
} satisfies Meta<typeof ColorInput>

export default meta
type Story = StoryObj<typeof meta>

export const input: Story = {
  args: {
    initialValue: '#336699',
  },
}

export const controlledValue: Story = {
  render: function ControlledValue(args) {
    const [value, setValue] = useState<HexColor>('#336699')

    return (
      <ColorInput
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

export const alpha: Story = {
  args: {
    hasAlpha: true,
    initialValue: '#336699cc',
    inputProps: {
      placeholder: '#000000ff',
    },
  },
}

export const controlledAlpha: Story = {
  args: {
    hasAlpha: true,
  },
  render: function ControlledAlpha(args) {
    const [value, setValue] = useState<HexColor>('#336699cc')

    return (
      <ColorInput
        {...args}
        hasAlpha
        value={value}
        onValueChange={(next) => {
          args.onValueChange?.(next)
          setValue(next)
        }}
      />
    )
  },
}
