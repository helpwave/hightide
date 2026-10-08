import { useCallback, useMemo } from 'react'
import clsx from 'clsx'
import { DateUtils, range } from '@helpwave/hightide-utils/utils'
import { useControlledState, useStableEvent } from '@helpwave/hightide-utils/hooks'

import { useLocalization } from '../../../global-contexts/localization/forward-exports'
import type { InputComponentInterface } from '../input/TextInput'
import { WheelPicker } from '../../interaction/WheelPicker'

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

function withYearMonth(date: Date, year: number, month: number) {
  const next = new Date(date)
  const lastDay = new Date(year, month + 1, 0).getDate()
  next.setFullYear(year, month, Math.min(date.getDate(), lastDay))
  return next
}

export type YearMonthPickerProps = InputComponentInterface<Date> & {
  start?: Date,
  end?: Date,
  className?: string,
}

export const YearMonthPicker = ({
  value: controlledValue,
  initialValue = new Date(),
  start = defaultStart,
  end = defaultEnd,
  onValueUpdate: onValueChange,
  onValueCommit: onEditComplete,
  className,
}: YearMonthPickerProps) => {
  const { locale } = useLocalization()
  const [value, setValue] = useControlledState({
    value: controlledValue,
    onValueChange,
    defaultValue: initialValue,
  })
  const onEditCompleteStable = useStableEvent(onEditComplete)

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

  const commit = useCallback((next: Date) => {
    setValue(next)
    onEditCompleteStable(next)
  }, [onEditCompleteStable, setValue])

  const selectYear = useCallback((year: number) => {
    const availableMonths = monthsForYear(year, minTimestamp, maxTimestamp)
    const month = availableMonths.includes(value.getMonth())
      ? value.getMonth()
      : availableMonths[0] ?? 0
    commit(withYearMonth(value, year, month))
  }, [commit, maxTimestamp, minTimestamp, value])

  const selectMonth = useCallback((month: number) => {
    commit(withYearMonth(value, value.getFullYear(), month))
  }, [commit, value])

  return (
    <div className={clsx('year-month-picker', className)}>
      <WheelPicker value={value.getMonth()} onValueChange={selectMonth}>
        {months.map((month) => (
          <WheelPicker.Option key={month} value={month} valueId={String(month)}>
            {monthNames[month]}
          </WheelPicker.Option>
        ))}
      </WheelPicker>
      <WheelPicker value={value.getFullYear()} onValueChange={selectYear}>
        {years.map((year) => (
          <WheelPicker.Option key={year} value={year} valueId={String(year)}>
            {year}
          </WheelPicker.Option>
        ))}
      </WheelPicker>
    </div>
  )
}
