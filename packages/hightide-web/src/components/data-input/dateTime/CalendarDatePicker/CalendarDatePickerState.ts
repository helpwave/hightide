import { DateUtils } from '@helpwave/hightide-utils/utils'

export type CalendarDisplayMode = 'yearMonth' | 'day' | 'time'

export type CalendarDatePickerState = {
  value: Date,
  displayedMonth: Date,
  displayMode: CalendarDisplayMode,
}

export type CalendarDatePickerEvent =
  | { type: 'setDisplayMode', displayMode: CalendarDisplayMode }
  | { type: 'today' }
  | { type: 'shiftMonth', direction: -1 | 1 }
  | { type: 'pickYearMonth', value: Date }
  | { type: 'setDayState', value: Date, displayedMonth: Date }

export function calendarDatePickerStateTransition(
  state: CalendarDatePickerState,
  event: CalendarDatePickerEvent
): CalendarDatePickerState {
  switch (event.type) {
  case 'setDisplayMode':
    return { ...state, displayMode: event.displayMode }
  case 'today': {
    const next = new Date()
    next.setHours(state.value.getHours(), state.value.getMinutes())
    return { ...state, value: next, displayedMonth: next }
  }
  case 'shiftMonth':
    return {
      ...state,
      displayedMonth: event.direction === 1
        ? DateUtils.addDuration(state.displayedMonth, { months: 1 })
        : DateUtils.subtractDuration(state.displayedMonth, { months: 1 }),
    }
  case 'pickYearMonth':
    return {
      ...state,
      value: event.value,
      displayedMonth: new Date(event.value.getFullYear(), event.value.getMonth(), 1),
    }
  case 'setDayState':
    return { ...state, value: event.value, displayedMonth: event.displayedMonth }
  }
}
