import { useEffect, useRef } from 'react'
import { equalSizeGroups, range } from '@/src/utils/array'
import clsx from 'clsx'
import { ExpandableContent, ExpandableHeader, ExpandableRoot } from '@/src/components/layout/Expandable'
import { addDuration, DateUtils, subtractDuration } from '@/src/utils/date'
import { useLocale } from '@/src/contexts/LocaleContext'
import { useOverwritableState } from '@/src/hooks/useOverwritableState'
import { Button } from '@/src/components/user-interaction/Button'

export type YearMonthPickerProps = {
  displayedYearMonth?: Date,
  start?: Date,
  end?: Date,
  onValueChange?: (date: Date) => void,
  className?: string,
  maxHeight?: number,
  showValueOpen?: boolean,
}

export const YearMonthPicker = ({
  displayedYearMonth = new Date(),
  start = subtractDuration(new Date(), { years: 50 }),
  end = addDuration(new Date(), { years: 50 }),
  onValueChange,
  className = '',
  showValueOpen = true
}: YearMonthPickerProps) => {
  const { locale } = useLocale()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollToItem = () => {
      if (ref.current) {
        ref.current.scrollIntoView({
          behavior: 'instant',
          block: 'center',
        })
      }
    }

    scrollToItem()
  }, [ref])

  if (end < start) {
    console.error(`startYear: (${start}) less than endYear: (${end})`)
    return null
  }

  const years = range([start.getFullYear(), end.getFullYear()], { exclusiveEnd: false })

  return (
    <div className={clsx('flex-col-1 select-none overflow-y-auto', className)}>
      {years.map(year => {
        const selectedYear = displayedYearMonth.getFullYear() === year
        return (
          <ExpandableRoot
            key={year}
            ref={(displayedYearMonth.getFullYear() ?? new Date().getFullYear()) === year ? ref : undefined}
            isExpanded={showValueOpen && selectedYear}
          >
            <ExpandableHeader className={clsx('px-2', { 'text-primary font-bold': selectedYear })}>
              {year}
            </ExpandableHeader>
            <ExpandableContent className="gap-y-1 px-2">
              {equalSizeGroups([...DateUtils.monthsList], 3).map((monthList, index) => (
                <div key={index} className="flex-row-1">
                  {monthList.map(month => {
                    const monthIndex = DateUtils.monthsList.indexOf(month)
                    const newDate = new Date(year, monthIndex)

                    const selectedMonth = selectedYear && monthIndex === displayedYearMonth.getMonth()
                    const firstOfMonth = new Date(year, monthIndex, 1)
                    const lastOfMonth = new Date(year, monthIndex, 1)
                    const isAfterStart = start === undefined || start <= addDuration(subtractDuration(lastOfMonth, { days: 1 }), { months: 1 })
                    const isBeforeEnd = end === undefined || firstOfMonth <= end
                    const isValid = isAfterStart && isBeforeEnd
                    return (
                      <Button
                        key={month}
                        disabled={!isValid}
                        color={selectedMonth && isValid ? 'primary' : 'neutral'}
                        className="flex-1"
                        size="sm"
                        onClick={() => {
                          onValueChange?.(newDate)
                        }}
                      >
                        {new Intl.DateTimeFormat(locale, { month: 'short' }).format(newDate)}
                      </Button>
                    )
                  })}
                </div>
              ))}
            </ExpandableContent>
          </ExpandableRoot>
        )
      })}
    </div>
  )
}

export const YearMonthPickerUncontrolled = ({
  displayedYearMonth,
  onValueChange,
  ...props
}: YearMonthPickerProps) => {
  const [yearMonth, setYearMonth] = useOverwritableState<Date>(displayedYearMonth, onValueChange)

  return (
    <YearMonthPicker
      displayedYearMonth={yearMonth}
      onValueChange={setYearMonth}
      {...props}
    />
  )
}
