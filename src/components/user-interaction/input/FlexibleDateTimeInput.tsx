import { DateUtils, type DateTimeFormat } from '@/src/utils/date'
import { DateTimeInput, type DateTimeInputProps } from './DateTimeInput'
import { forwardRef, useMemo, useState } from 'react'
import { useControlledState } from '@/src/hooks/useControlledState'
import { IconButton } from '../IconButton'
import { ClockFading, ClockPlus } from 'lucide-react'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'

export interface FlexibleDateTimeInputProps extends Omit<DateTimeInputProps, 'mode'> {
  defaultMode: Exclude<DateTimeFormat, 'time'>,
  /** Defaults to 23:59:59.999 */
  fixedTime?: Date | null,
}

export const FlexibleDateTimeInput = forwardRef<HTMLInputElement, FlexibleDateTimeInputProps>(function FlexibleDateTimeInput({
  defaultMode = 'date',
  value: controlledValue,
  initialValue,
  onValueChange,
  fixedTime: fixedTimeOverride,
  actions = [],
  ...props
}, forwardedRef) {
  const translation = useHightideTranslation()
  const [value, setValue] = useControlledState<Date | null>({
    value: controlledValue,
    onValueChange: onValueChange,
    defaultValue: initialValue,
  })
  const fixedTime = useMemo(() => fixedTimeOverride ?? new Date(1970, 0, 1, 23, 59, 59, 999), [fixedTimeOverride])
  const [preferredMode, setPreferredMode] = useState<DateTimeFormat>(() => {
    if(!value) return defaultMode
    if(DateUtils.sameTime(value, fixedTime, true, true)) {
      return 'date'
    }
    return 'dateTime'
  })

  return (
    <DateTimeInput
      {...props}
      ref={forwardedRef}
      mode={preferredMode}
      value={value}
      onValueChange={value => {
        if(preferredMode === 'date')
          setValue(DateUtils.withTime(value, fixedTime))
        else
          setValue(DateUtils.isLastMillisecondOfDay(value) ? new Date(value.getTime() - 1) : new Date(value.getTime() + 1))
      }}
      actions={[
        ...actions,
        <IconButton
          key="date-mode"
          size="sm"
          coloringStyle="text"
          color="neutral"
          tooltip={preferredMode === 'date' ? translation('addTime') : translation('withoutTime')}
          onClick={() => {
            const newMode = preferredMode === 'date' ? 'dateTime' : 'date'
            if(value) {
              if(newMode === 'date') {
                setValue(DateUtils.withTime(value, fixedTime))
              } else {
                setValue(DateUtils.isLastMillisecondOfDay(value) ? new Date(value.getTime() - 1) : new Date(value.getTime() + 1))
              }
            }
            setPreferredMode(newMode)
          }}
        >
          {preferredMode === 'date' ? <ClockPlus className="size-5"/> : <ClockFading className="size-5"/>}
        </IconButton>,
      ]}
    />
  )
})