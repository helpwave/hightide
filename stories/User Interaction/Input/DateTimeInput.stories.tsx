import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import { useEffect, useState } from 'react'
import { DateTimeInput } from '@/src/components/user-interaction/input/DateTimeInput'

const meta: Meta<typeof DateTimeInput> = {
  component: DateTimeInput,
}

export default meta
type Story = StoryObj<typeof meta>;

export const dateTimeInput: Story = {
  args: {
    mode: 'date',
    disabled: false,
    readOnly: false,
    invalid: false,
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
      <DateTimeInput
        {...args}
        value={value}
        onValueChange={(next) => {
          args.onValueChange?.(next)
          setValue(next)
        }}
        onEditComplete={(next) => {
          args.onEditComplete?.(next)
          setValue(next)
        }}
      />
    )
  },
}
