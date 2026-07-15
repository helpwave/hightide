import { forwardRef, useState } from 'react'
import { ClockFading, ClockPlus } from 'lucide-react'
import { DateUtils, type DateTimeFormat } from '@helpwave/hightide-utils'
import { DateTimeInput, type DateTimeInputProps } from './DateTimeInput'
import { useControlledState } from '@helpwave/hightide-utils'
import { IconButton } from '../IconButton'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { useLocalization } from '@/src/global-contexts/LocalizationProvider'

export interface FlexibleDateTimeInputProps extends Omit<DateTimeInputProps, 'mode'> {
  defaultMode: Exclude<DateTimeFormat, 'time'>,
  fixedTime?: Date | null,
}

export const FlexibleDateTimeInput = forwardRef<HTMLDivElement, FlexibleDateTimeInputProps>(function FlexibleDateTimeInput({
  defaultMode = 'date',
  value: controlledValue,
  initialValue,
  onValueChange,
  fixedTime: fixedTimeOverride,
  timeZone: timeZoneOverride,
  actions = [],
  ...props
}, forwardedRef) {
  const translation = useHightideTranslation()
  const { timeZone: contextTimeZone } = useLocalization()
  const timeZone = timeZoneOverride ?? contextTimeZone
  const fixedTime = fixedTimeOverride ?? new Date(1970, 0, 1, 23, 59, 59, 999)
  const [value, setValue] = useControlledState<Date | null>({
    value: controlledValue,
    onValueChange,
    defaultValue: initialValue,
  })

  const zoned = (date: Date) => DateUtils.toZonedDate(date, timeZone)
  const unzoned = (date: Date) => DateUtils.fromZonedDate(date, timeZone)
  const hasFixedTime = (date: Date) => DateUtils.sameTime(zoned(date), fixedTime, true, true)

  const [mode, setMode] = useState<Exclude<DateTimeFormat, 'time'>>(() => {
    if (value && !hasFixedTime(value)) {
      return 'dateTime'
    }
    return defaultMode
  })

  const toDate = (date: Date) => unzoned(DateUtils.withTime(zoned(date), fixedTime))
  const toDateTime = (date: Date) => hasFixedTime(date) ? unzoned(DateUtils.withTime(zoned(date), zoned(new Date()))) : date

  return (
    <DateTimeInput
      {...props}
      ref={forwardedRef}
      timeZone={timeZone}
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
