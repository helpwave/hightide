import { DateUtils } from '@helpwave/hightide-utils/utils'
import { useCalendarDayPickerContext } from './CalendarDayPickerContext'

export function CalendarDayPickerHeader() {
  const { state, config } = useCalendarDayPickerContext()
  const weeks = DateUtils.weeksForCalenderMonth(state.displayedMonth, config.weekStart)
  const headerWeek = weeks[0]

  if (!headerWeek) {
    return null
  }

  return (
    <div className="calendar-day-picker-header-row">
      {headerWeek.map((weekDay, index) => (
        <div key={index} className="calendar-day-picker-header-item">
          {new Intl.DateTimeFormat(config.locale, { weekday: 'long' }).format(weekDay).substring(0, 2)}
        </div>
      ))}
    </div>
  )
}
