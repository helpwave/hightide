import { DateUtils } from '@helpwave/hightide-utils/utils'
import type { WheelLoopingBehaviour } from '../TimeWheelPicker'

export type DateWheelPickerState = {
  value: Date,
}

export type DateWheelPickerEvent =
  | { type: 'setDay', day: number }
  | { type: 'setMonth', month: number }
  | { type: 'setYear', year: number }
  | { type: 'loopDay', direction: 1 | -1 }
  | { type: 'loopMonth', direction: 1 | -1 }

export type DateWheelPickerTransitionOptions = {
  minTimestamp?: number,
  maxTimestamp?: number,
  loopingBehaviour: WheelLoopingBehaviour,
}

export function dateWheelPickerStateTransition(
  state: DateWheelPickerState,
  event: DateWheelPickerEvent,
  options: DateWheelPickerTransitionOptions
): DateWheelPickerState {
  const current = state.value
  switch (event.type) {
  case 'setDay':
    return { value: DateUtils.withDateParts(current, current.getFullYear(), current.getMonth(), event.day) }
  case 'setMonth':
    return { value: DateUtils.withDateParts(current, current.getFullYear(), event.month, current.getDate()) }
  case 'setYear': {
    const months = DateUtils.monthsForYear(event.year, options.minTimestamp, options.maxTimestamp)
    const month = months.includes(current.getMonth())
      ? current.getMonth()
      : months[0] ?? 0
    return { value: DateUtils.withDateParts(current, event.year, month, current.getDate()) }
  }
  case 'loopDay': {
    if (options.loopingBehaviour === 'ignore') {
      return state
    }
    const next = new Date(current)
    if (event.direction === 1) {
      next.setDate(1)
      next.setMonth(next.getMonth() + 1)
    } else {
      next.setDate(0)
    }
    return { value: next }
  }
  case 'loopMonth': {
    if (options.loopingBehaviour === 'ignore') {
      return state
    }
    return { value: DateUtils.withDateParts(current, current.getFullYear() + event.direction, current.getMonth(), current.getDate()) }
  }
  }
}

export function daysForMonth(value: Date, minTimestamp: number, maxTimestamp: number) {
  const count = DateUtils.daysInMonth(value.getFullYear(), value.getMonth())
  return Array.from({ length: count }, (_, index) => index + 1).filter((day) => {
    const timestamp = new Date(value.getFullYear(), value.getMonth(), day).getTime()
    return timestamp >= minTimestamp && timestamp <= maxTimestamp
  })
}
