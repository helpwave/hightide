import { forwardRef, useState } from 'react'
import { ClockFading, ClockPlus } from 'lucide-react'
import { DateUtils, type DateTimeFormat } from '@/src/utils/date'
import { DateTimeInput, type DateTimeInputProps } from './DateTimeInput'
import { useControlledState } from '@/src/hooks/useControlledState'
import { IconButton } from '../IconButton'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'

export interface FlexibleDateTimeInputProps extends Omit<DateTimeInputProps, 'mode'> {
  defaultMode: Exclude<DateTimeFormat, 'time'>,
  /** The time of day used while no explicit time is set. Defaults to 23:59:59.999 */
  fixedTime?: Date | null,
}

/**
 * A date input that can optionally be extended with a time.
 *
 * While only a date is shown the value is anchored to a fixed time of day (end of day by
 * default). Adding a time switches to a full date and time editor seeded with the current time.
 */
export const FlexibleDateTimeInput = forwardRef<HTMLDivElement, FlexibleDateTimeInputProps>(function FlexibleDateTimeInput({
  defaultMode = 'date',
  value: controlledValue,
  initialValue,
  onValueChange,
  fixedTime: fixedTimeOverride,
  actions = [],
  ...props
}, forwardedRef) {
  const translation = useHightideTranslation()
  const fixedTime = fixedTimeOverride ?? new Date(1970, 0, 1, 23, 59, 59, 999)
  const [value, setValue] = useControlledState<Date | null>({
    value: controlledValue,
    onValueChange,
    defaultValue: initialValue,
  })
  const [mode, setMode] = useState<Exclude<DateTimeFormat, 'time'>>(() => {
    if (value && !DateUtils.sameTime(value, fixedTime, true, true)) {
      return 'dateTime'
    }
    return defaultMode
  })

  const toDate = (date: Date) => DateUtils.withTime(date, fixedTime)
  const toDateTime = (date: Date) => DateUtils.sameTime(date, fixedTime, true, true) ? DateUtils.withTime(date, new Date()) : date

  return (
    <DateTimeInput
      {...props}
      ref={forwardedRef}
      mode={mode}
      value={value}
      onValueChange={(next) => {
        setValue(next === null ? null : (mode === 'date' ? toDate(next) : next))
      }}
      actions={[
        ...actions,
        <IconButton
          key="flexible-date-time-mode"
          size="sm"
          coloringStyle="text"
          color="neutral"
          tooltip={mode === 'date' ? translation('addTime') : translation('withoutTime')}
          onClick={() => {
            const nextMode = mode === 'date' ? 'dateTime' : 'date'
            if (value) {
              setValue(nextMode === 'date' ? toDate(value) : toDateTime(value))
            }
            setMode(nextMode)
          }}
        >
          {mode === 'date' ? <ClockPlus className="size-5"/> : <ClockFading className="size-5"/>}
        </IconButton>,
      ]}
    />
  )
})
