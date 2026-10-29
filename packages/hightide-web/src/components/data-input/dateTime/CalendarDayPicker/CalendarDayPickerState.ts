import { DateUtils } from '@helpwave/hightide-utils/utils'

export type CalendarDayPickerState = {
  value: Date,
  displayedMonth: Date,
}

export type CalendarDayPickerEvent =
  | { type: 'selectDay', date: Date }
  | { type: 'moveTo', date: Date }

export type CalendarDayPickerTransitionOptions = {
  start?: Date,
  end?: Date,
}

function clampToRange(date: Date, start?: Date, end?: Date) {
  if (start && date < start) {
    return start
  }
  if (end && date > end) {
    return end
  }
  return date
}

function firstDayOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function calendarDayPickerStateTransition(
  state: CalendarDayPickerState,
  event: CalendarDayPickerEvent,
  options: CalendarDayPickerTransitionOptions
): CalendarDayPickerState {
  switch (event.type) {
  case 'selectDay': {
    if (!DateUtils.between(event.date, options.start, options.end)) {
      return state
    }
    const next = new Date(
      event.date.getFullYear(),
      event.date.getMonth(),
      event.date.getDate(),
      state.value.getHours(),
      state.value.getMinutes(),
      state.value.getSeconds(),
      state.value.getMilliseconds()
    )
    const displayedMonth = next.getMonth() !== state.displayedMonth.getMonth()
      ? firstDayOfMonth(next)
      : state.displayedMonth
    return { value: next, displayedMonth }
  }
  case 'moveTo': {
    const clamped = clampToRange(event.date, options.start, options.end)
    if (!DateUtils.between(clamped, options.start, options.end)) {
      return state
    }
    const displayedMonth = clamped.getMonth() !== state.displayedMonth.getMonth() || clamped.getFullYear() !== state.displayedMonth.getFullYear()
      ? firstDayOfMonth(clamped)
      : state.displayedMonth
    return { value: clamped, displayedMonth }
  }
  }
}
