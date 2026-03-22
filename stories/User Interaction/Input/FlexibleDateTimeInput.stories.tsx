import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import { useEffect, useState } from 'react'
import { FlexibleDateTimeInput } from '@/src/components/user-interaction/input/FlexibleDateTimeInput'

const meta: Meta<typeof FlexibleDateTimeInput> = {
  component: FlexibleDateTimeInput,
}

export default meta
type Story = StoryObj<typeof meta>;

export const flexibleDateTimeInput: Story = {
  args: {
    defaultMode: 'date',
    disabled: false,
    invalid: false,
    readOnly: false,
    required: false,
    precision: 'minute',
    minuteIncrement: '5min',
    secondIncrement: '1s',
    millisecondIncrement: '100ms',
    is24HourFormat: false,
    initialValue: null,
    value: undefined,
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
  },
  render: (args) => {
    const [value, setValue] = useState<Date | null>(args.initialValue ?? null)
    useEffect(() => {
      setValue(args.value ?? args.initialValue ?? null)
    }, [args.value, args.initialValue])
    return (
      <FlexibleDateTimeInput
        {...args}
        value={value}
        onValueChange={(v) => {
          args.onValueChange?.(v)
          setValue(v)
        }}
        onEditComplete={(v) => {
          args.onEditComplete?.(v)
          setValue(v)
        }}
      />
    )
  },
}
