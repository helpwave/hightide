import { ClockFading, ClockPlus } from 'lucide-react'
import { DateUtils } from '@helpwave/hightide-utils/utils'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { IconButton } from '../../../interaction/IconButton'
import { useFlexibleDateTimeInputContext } from './FlexibleDateTimeInputContext'

export type FlexibleDateTimeInputModeButtonProps = {
  timeZone: string,
  fixedTime: Date,
}

export function FlexibleDateTimeInputModeButton({ timeZone, fixedTime }: FlexibleDateTimeInputModeButtonProps) {
  const translation = useHightideTranslation()
  const { state, dispatch } = useFlexibleDateTimeInputContext()
  const zoned = (date: Date) => DateUtils.toZonedDate(date, timeZone)
  const unzoned = (date: Date) => DateUtils.fromZonedDate(date, timeZone)
  const hasFixedTime = (date: Date) => DateUtils.sameTime(zoned(date), fixedTime, true, true)
  const toDate = (date: Date) => unzoned(DateUtils.withTime(zoned(date), fixedTime))
  const toDateTime = (date: Date) => hasFixedTime(date)
    ? unzoned(DateUtils.withTime(zoned(date), zoned(new Date())))
    : date

  return (
    <IconButton
      key="flexible-date-time-mode"
      size="sm"
      variant="foreground"
      color="neutral"
      tooltip={state.mode === 'date' ? translation('addTime') : translation('withoutTime')}
      onClick={() => {
        const nextMode = state.mode === 'date' ? 'dateTime' : 'date'
        const nextValue = state.value
          ? (nextMode === 'date' ? toDate(state.value) : toDateTime(state.value))
          : null
        dispatch({ type: 'setMode', mode: nextMode, value: nextValue })
      }}
      icon={state.mode === 'date' ? ClockPlus : ClockFading}
    />
  )
}
