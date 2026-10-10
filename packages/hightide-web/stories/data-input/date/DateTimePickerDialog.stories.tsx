import type { Meta, StoryObj } from '@storybook/react-vite'
import { action } from 'storybook/actions'
import { useEffect, useState } from 'react'
import { DateTimePickerDialog } from '../../../src/components/data-input/date/DateTimePickerDialog'
import { DateUtils } from '@helpwave/hightide-utils/utils'

const meta: Meta<typeof DateTimePickerDialog> = {
  component: DateTimePickerDialog,
}

export default meta
type Story = StoryObj<typeof meta>

export const dateTimePickerDialog: Story = {
  args: {
    mode: 'dateTime',
    initialValue: new Date(),
    allowRemove: true,
    start: DateUtils.subtractDuration(new Date(), { years: 50 }),
    end: DateUtils.addDuration(new Date(), { years: 50 }),
    weekStart: 'monday',
    markToday: true,
    is24HourFormat: true,
    precision: 'minute',
    minuteIncrement: '5min',
    secondIncrement: '1s',
    millisecondIncrement: '100ms',
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
  },
  render: ({ initialValue, ...args }) => {
    const [value, setValue] = useState<Date | null>(initialValue ?? null)

    useEffect(() => {
      setValue(initialValue ?? null)
    }, [initialValue])

    return (
      <div
        className="date-time-input-dialog-popup"
        data-mode={args.mode}
        data-time-format={args.is24HourFormat ? '24h' : '12h'}
      >
        <DateTimePickerDialog
          {...args}
          value={value}
          onValueUpdate={(next) => {
            args.onValueChange?.(next)
            setValue(next)
          }}
          onValueCommit={(next) => {
            args.onEditComplete?.(next)
            setValue(next)
          }}
        />
      </div>
    )
  },
}
