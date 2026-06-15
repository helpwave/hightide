import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { action } from 'storybook/actions'
import { useEffect, useState } from 'react'
import { FlexibleDateTimeInput } from '@/src/components/user-interaction/input/FlexibleDateTimeInput'
import { TimeDisplay } from '@/src/components/user-interaction/date/TimeDisplay'
import { LocaleContext } from '@/src/global-contexts/LocaleContext'

const timeZones = ['', 'UTC', 'America/New_York', 'Europe/Berlin', 'Asia/Tokyo', 'Pacific/Kiritimati']

const meta: Meta<typeof FlexibleDateTimeInput> = {
  component: FlexibleDateTimeInput,
  argTypes: {
    timeZone: {
      control: 'select',
      options: timeZones,
      description: 'Display and edit the value in this IANA time zone. Empty uses the local zone.',
    },
  },
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
    is24HourFormat: true,
    timeZone: '',
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
          <div className="flex-col-1 text-sm text-description">
            <pre>value = {value === null ? 'null' : value.toISOString()}</pre>
            {value && args.timeZone && (
              <pre>
                {`in ${args.timeZone} = ${new Intl.DateTimeFormat('de-DE', {
                  timeZone: args.timeZone,
                  dateStyle: 'short',
                  timeStyle: 'medium',
                }).format(value)}`}
              </pre>
            )}
            {value && <TimeDisplay date={value} mode="date"/>}
          </div>
        </div>
      </LocaleContext.Provider>
    )
  },
}
