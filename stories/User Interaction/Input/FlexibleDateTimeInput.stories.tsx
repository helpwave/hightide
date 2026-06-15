import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import { useEffect, useState } from 'react'
import { FlexibleDateTimeInput } from '@/src/components/user-interaction/input/FlexibleDateTimeInput'
import { LocaleContext } from '@/src/global-contexts/LocaleContext'

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
      <LocaleContext.Provider value={{ locale: 'de-DE', setLocale: () => {} }}>
        <div className="flex-col-2 w-full max-w-md">
          <FlexibleDateTimeInput
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
          <pre className="text-sm text-description">value = {value === null ? 'null' : value.toISOString()}</pre>
        </div>
      </LocaleContext.Provider>
    )
  },
}
