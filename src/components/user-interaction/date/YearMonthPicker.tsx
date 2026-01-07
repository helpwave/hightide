import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { equalSizeGroups, range } from '@/src/utils/array'
import clsx from 'clsx'
import { ExpandableContent, ExpandableHeader, ExpandableRoot } from '@/src/components/layout/Expandable'
import { addDuration, DateUtils, subtractDuration } from '@/src/utils/date'
import { useLocale } from '@/src/contexts/LocaleContext'
import { useOverwritableState } from '@/src/hooks/useOverwritableState'
import { Button } from '@/src/components/user-interaction/Button'
import type { FormFieldDataHandling } from '../../form/FormField'
import { InfiniteScroll } from '../../layout/InifiniteScroll'

// A performance optimized component for displayig the year rows
const YearRow = memo(function YearRow({
  year,
  selectedMonthIndex,
  minTimestamp,
  maxTimestamp,
  monthNames,
  onSelect
}: {
  year: number,
  selectedMonthIndex?: number,
  minTimestamp?: number,
  maxTimestamp?: number,
  monthNames: string[],
  onSelect: (date: Date) => void,
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isSelectedYear = selectedMonthIndex !== undefined
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (isSelectedYear) {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [isSelectedYear])

  const monthGrid = useMemo(() => equalSizeGroups([...DateUtils.monthsList], 3), [])

  return (
    <ExpandableRoot
      ref={isSelectedYear ? ref : undefined}
      isExpanded={isExpanded}
      onExpandedChange={setIsExpanded}
    >
      <ExpandableHeader className={clsx('px-2', { 'text-primary font-bold': isSelectedYear })}>
        {year}
      </ExpandableHeader>
      <ExpandableContent className="gap-y-1 px-2 expadable-content-h-39">
        {isExpanded && monthGrid.map((group, groupIdx) => (
          <div key={groupIdx} className="flex-row-1">
            {group.map(month => {
              const monthIndex = DateUtils.monthsList.indexOf(month)

              const currentTimestamp = new Date(year, monthIndex).getTime()
              const isAfterStart = minTimestamp === undefined || currentTimestamp >= minTimestamp
              const isBeforeEnd = maxTimestamp === undefined || currentTimestamp <= maxTimestamp
              const isValid = isAfterStart && isBeforeEnd
              const isSelectedMonth = monthIndex === selectedMonthIndex

              return (
                <Button
                  key={month}
                  disabled={!isValid}
                  color={isSelectedMonth && isValid ? 'primary' : 'neutral'}
                  className="flex-1"
                  size="sm"
                  onClick={() => {
                    if (isValid) {
                      onSelect(new Date(year, monthIndex))
                    }
                  }}
                >
                  {monthNames[monthIndex]}
                </Button>
              )
            })}
          </div>
        ))}
      </ExpandableContent>
    </ExpandableRoot>
  )
})

const defaultStart = subtractDuration(new Date(), { years: 100 })
const defaultEnd = addDuration(new Date(), { years: 100 })

export type YearMonthPickerProps = Partial<FormFieldDataHandling<Date>> & {
  start?: Date,
  end?: Date,
  className?: string,
}

export const YearMonthPicker = ({
  value = new Date(),
  start = defaultStart,
  end = defaultEnd,
  onValueChange,
  onEditComplete,
  className,
}: YearMonthPickerProps) => {
  const { locale } = useLocale()

  const monthNames = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale, { month: 'short' })
    return Array.from({ length: 12 }, (_, i) => formatter.format(new Date(2000, i, 1)))
  }, [locale])

  const years = useMemo(() =>
    range([start.getFullYear(), end.getFullYear()], { exclusiveEnd: false }),
  [start, end])

  const minTimestamp = useMemo(() =>{
    if(!start) return
    return new Date(start.getFullYear(), start.getMonth(), 1).getTime()
  }, [start])
  const maxTimestamp = useMemo(() => {
    if(!end) return
    return new Date(end.getFullYear(), end.getMonth() + 1, 0).getTime()
  }, [end])

  const callbackRefs = useRef({ onValueChange, onEditComplete })
  useLayoutEffect(() => {
    callbackRefs.current = { onValueChange, onEditComplete }
  })
  const handleSelect = useCallback((newDate: Date) => {
    const { onValueChange, onEditComplete } = callbackRefs.current

    onValueChange?.(newDate)
    onEditComplete?.(newDate)
  }, [])

  return (
    <InfiniteScroll
      itemCount={years.length}
      className={clsx('flex-col-1 h-full select-none', className)}
      initialIndex={years.findIndex(year => year === value.getFullYear())}
    >
      {(index => {
        const year = years[index]
        const isSelectedYear = value.getFullYear() === year
        const selectedMonthIndex = isSelectedYear ? value.getMonth() : undefined

        return (
          <YearRow
            key={year}
            year={year}
            selectedMonthIndex={selectedMonthIndex}
            minTimestamp={minTimestamp}
            maxTimestamp={maxTimestamp}
            monthNames={monthNames}
            onSelect={handleSelect}
          />
        )
      })}
    </InfiniteScroll>
  )
}

export const YearMonthPickerUncontrolled = ({
  value: initialValue,
  onValueChange,
  ...props
}: YearMonthPickerProps) => {
  const [value, setValue] = useOverwritableState<Date>(initialValue, onValueChange)

  return (
    <YearMonthPicker
      value={value}
      onValueChange={setValue}
      {...props}
    />
  )
}
