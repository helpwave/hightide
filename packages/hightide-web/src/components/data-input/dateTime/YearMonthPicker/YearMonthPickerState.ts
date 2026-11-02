import { DateUtils } from '@helpwave/hightide-utils/utils'

export type YearMonthPickerState = {
  value: Date,
}

export type YearMonthPickerEvent =
  | { type: 'setMonth', month: number }
  | { type: 'setYear', year: number }

export type YearMonthPickerTransitionOptions = {
  minTimestamp?: number,
  maxTimestamp?: number,
}

export function yearMonthPickerStateTransition(
  state: YearMonthPickerState,
  event: YearMonthPickerEvent,
  options: YearMonthPickerTransitionOptions
): YearMonthPickerState {
  switch (event.type) {
  case 'setMonth':
    return { value: DateUtils.withYearMonth(state.value, state.value.getFullYear(), event.month) }
  case 'setYear': {
    const months = DateUtils.monthsForYear(event.year, options.minTimestamp, options.maxTimestamp)
    const month = months.includes(state.value.getMonth())
      ? state.value.getMonth()
      : months[0] ?? 0
    return { value: DateUtils.withYearMonth(state.value, event.year, month) }
  }
  }
}
