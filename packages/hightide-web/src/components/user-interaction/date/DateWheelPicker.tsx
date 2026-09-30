import { useCallback, useMemo, useRef } from 'react'
import clsx from 'clsx'
import { DateUtils, range } from '@helpwave/hightide-utils/utils'
import { useControlledState, useEventCallbackStabilizer } from '@helpwave/hightide-utils/hooks'

import { useLocalization } from '../../../global-contexts/localization/forward-exports'
import type { InputInterface } from '../input/Input'
import { WheelPicker } from '../WheelPicker'
import type { WheelLoopingBehaviour } from './TimeWheelPicker'

const defaultStart = DateUtils.subtractDuration(new Date(), { years: 100 })
const defaultEnd = DateUtils.addDuration(new Date(), { years: 100 })

function monthsForYear(year: number, minTimestamp?: number, maxTimestamp?: number) {
  return range(12).filter((month) => {
    const monthStart = new Date(year, month, 1).getTime()
    const monthEnd = new Date(year, month + 1, 0).getTime()
    const isAfterStart = minTimestamp === undefined || monthEnd >= minTimestamp
    const isBeforeEnd = maxTimestamp === undefined || monthStart <= maxTimestamp
    return isAfterStart && isBeforeEnd
  })
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function withDateParts(date: Date, year: number, month: number, day: number) {
  const next = new Date(date)
  const lastDay = daysInMonth(year, month)
  next.setFullYear(year, month, Math.min(day, lastDay))
  return next
}

export type DateWheelPickerProps = InputInterface<Date> & {
  start?: Date,
  end?: Date,
  isLooping?: boolean,
  loopingBehaviour?: WheelLoopingBehaviour,
  className?: string,
}

export const DateWheelPicker = ({
  value: controlledValue,
  initialValue = new Date(),
  start = defaultStart,
  end = defaultEnd,
  onValueChange,
  onEditComplete,
  isLooping = true,
  loopingBehaviour = 'update',
  className,
}: DateWheelPickerProps) => {
  const { locale } = useLocalization()
  const [value, setValue] = useControlledState({
    value: controlledValue,
    onValueChange,
    defaultValue: initialValue,
  })
  const valueRef = useRef(value)
  valueRef.current = value
  const onEditCompleteStable = useEventCallbackStabilizer(onEditComplete)

  const monthNames = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale, { month: 'short' })
    return Array.from({ length: 12 }, (_, index) => formatter.format(new Date(2000, index, 1)))
  }, [locale])

  const years = useMemo(() =>
    range([start.getFullYear(), end.getFullYear()], { exclusiveEnd: false }),
  [end, start])

  const minTimestamp = useMemo(() => new Date(start.getFullYear(), start.getMonth(), 1).getTime(), [start])
  const maxTimestamp = useMemo(() => new Date(end.getFullYear(), end.getMonth() + 1, 0).getTime(), [end])
  const months = useMemo(
    () => monthsForYear(value.getFullYear(), minTimestamp, maxTimestamp),
    [maxTimestamp, minTimestamp, value]
  )
  const days = useMemo(() => {
    const count = daysInMonth(value.getFullYear(), value.getMonth())
    return range(count).map((day) => day + 1).filter((day) => {
      const timestamp = new Date(value.getFullYear(), value.getMonth(), day).getTime()
      return timestamp >= minTimestamp && timestamp <= maxTimestamp
    })
  }, [maxTimestamp, minTimestamp, value])

  const commit = useCallback((next: Date) => {
    valueRef.current = next
    setValue(next)
    onEditCompleteStable(next)
  }, [onEditCompleteStable, setValue])

  const selectDay = useCallback((day: number) => {
    commit(withDateParts(valueRef.current, valueRef.current.getFullYear(), valueRef.current.getMonth(), day))
  }, [commit])

  const selectMonth = useCallback((month: number) => {
    const current = valueRef.current
    commit(withDateParts(current, current.getFullYear(), month, current.getDate()))
  }, [commit])

  const selectYear = useCallback((year: number) => {
    const current = valueRef.current
    const availableMonths = monthsForYear(year, minTimestamp, maxTimestamp)
    const month = availableMonths.includes(current.getMonth())
      ? current.getMonth()
      : availableMonths[0] ?? 0
    commit(withDateParts(current, year, month, current.getDate()))
  }, [commit, maxTimestamp, minTimestamp])

  const loopDay = useCallback((direction: 1 | -1) => {
    if (loopingBehaviour === 'ignore') {
      return
    }
    const current = valueRef.current
    const next = new Date(current)
    if (direction === 1) {
      next.setDate(1)
      next.setMonth(next.getMonth() + 1)
    } else {
      next.setDate(0)
    }
    commit(next)
  }, [commit, loopingBehaviour])

  const loopMonth = useCallback((direction: 1 | -1) => {
    if (loopingBehaviour === 'ignore') {
      return
    }
    const current = valueRef.current
    commit(withDateParts(current, current.getFullYear() + direction, current.getMonth(), current.getDate()))
  }, [commit, loopingBehaviour])

  return (
    <div className={clsx('date-wheel-picker', className)}>
      <WheelPicker value={value.getDate()} onValueChange={selectDay} onLoop={({ direction }) => loopDay(direction)} isLooping={isLooping}>
        {days.map((day) => (
          <WheelPicker.Option key={day} value={day} valueId={String(day)}>
            {String(day).padStart(2, '0')}
          </WheelPicker.Option>
        ))}
      </WheelPicker>
      <WheelPicker value={value.getMonth()} onValueChange={selectMonth} onLoop={({ direction }) => loopMonth(direction)} isLooping={isLooping}>
        {months.map((month) => (
          <WheelPicker.Option key={month} value={month} valueId={String(month)}>
            {monthNames[month]}
          </WheelPicker.Option>
        ))}
      </WheelPicker>
      <WheelPicker value={value.getFullYear()} onValueChange={selectYear} isLooping={isLooping}>
        {years.map((year) => (
          <WheelPicker.Option key={year} value={year} valueId={String(year)}>
            {year}
          </WheelPicker.Option>
        ))}
      </WheelPicker>
    </div>
  )
}
