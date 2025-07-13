import { useEffect, useRef, useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { noop } from '../../util/noop'
import { equalSizeGroups, range } from '../../util/array'
import clsx from 'clsx'
import { ExpandableUncontrolled } from '../layout-and-navigation/Expandable'
import { addDuration, monthsList, subtractDuration } from '../../util/date'
import { useLocale } from '../../localization/LanguageProvider'
import { SolidButton } from '../user-action/Button'

export type YearMonthPickerProps = {
  displayedYearMonth?: Date,
  start?: Date,
  end?: Date,
  onChange?: (date: Date) => void,
  className?: string,
  maxHeight?: number,
  showValueOpen?: boolean,
}

// TODO use a dynamically loading infinite list here
export const YearMonthPicker = ({
                                  displayedYearMonth = new Date(),
                                  start = subtractDuration(new Date(), { years: 50 }),
                                  end = addDuration(new Date(), { years: 50 }),
                                  onChange = noop,
                                  className = '',
                                  maxHeight = 300,
                                  showValueOpen = true
                                }: YearMonthPickerProps) => {
  const locale = useLocale()
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
    <div className={clsx('flex-col-0 select-none', className)}>
      <Scrollbars autoHeight autoHeightMax={maxHeight} style={{ height: '100%' }}>
        <div className="flex-col-1 mr-3">
          {years.map(year => {
            const selectedYear = displayedYearMonth.getFullYear() === year
            return (
              <ExpandableUncontrolled
                key={year}
                ref={(displayedYearMonth.getFullYear() ?? new Date().getFullYear()) === year ? ref : undefined}
                label={<span className={clsx({ 'text-primary font-bold': selectedYear })}>{year}</span>}
                isExpanded={showValueOpen && selectedYear}
                contentClassName="gap-y-1"
              >
                {equalSizeGroups([...monthsList], 3).map((monthList, index) => (
                  <div key={index} className="flex-row-1">
                    {monthList.map(month => {
                      const monthIndex = monthsList.indexOf(month)
                      const newDate = new Date(year, monthIndex)

                      const selectedMonth = selectedYear && monthIndex === displayedYearMonth.getMonth()
                      const firstOfMonth = new Date(year, monthIndex, 1)
                      const lastOfMonth = new Date(year, monthIndex, 1)
                      const isAfterStart = start === undefined || start <= addDuration(subtractDuration(lastOfMonth, { days: 1 }), { months: 1 })
                      const isBeforeEnd = end === undefined || firstOfMonth <= end
                      const isValid = isAfterStart && isBeforeEnd
                      return (
                        <SolidButton
                          key={month}
                          disabled={!isValid}
                          color={selectedMonth && isValid ? 'primary' : 'neutral'}
                          className="flex-1"
                          size="small"
                          onClick={() => {
                            onChange(newDate)
                          }}
                        >
                          {new Intl.DateTimeFormat(locale, { month: 'short' }).format(newDate)}
                        </SolidButton>
                      )
                    })}
                  </div>
                ))}
              </ExpandableUncontrolled>
            )
          })}
        </div>
      </Scrollbars>
    </div>
  )
}

export const YearMonthPickerUncontrolled = ({
                                              displayedYearMonth,
                                              onChange = noop,
                                              ...props
                                            }: YearMonthPickerProps) => {
  const [yearMonth, setYearMonth] = useState<Date>(displayedYearMonth ?? new Date())

  useEffect(() => setYearMonth(displayedYearMonth), [displayedYearMonth])

  return (
    <YearMonthPicker
      displayedYearMonth={yearMonth}
      onChange={date => {
        setYearMonth(date)
        onChange(date)
      }}
      {...props}
    />
  )
}
