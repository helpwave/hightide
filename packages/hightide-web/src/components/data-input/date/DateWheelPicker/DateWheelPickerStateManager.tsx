import type { ReactNode } from 'react'
import { useMemo } from 'react'
import type { InputStateMangerProps } from '@helpwave/hightide-utils/interfaces'
import { DateUtils } from '@helpwave/hightide-utils/utils'
import { useLocalization } from '../../../../global-contexts/localization/forward-exports'
import { dateInputConfig, useDateStateMachine } from '../useDateStateMachine'
import type { WheelLoopingBehaviour } from '../TimeWheelPicker'
import { defaultWheelLoopingBehaviour } from '../TimeWheelPicker/TimeWheelPickerState'
import { DateWheelPickerContext, type DateWheelPickerContextConfig } from './DateWheelPickerContext'
import {
  dateWheelPickerStateTransition,
  daysForMonth,
  type DateWheelPickerEvent,
  type DateWheelPickerState
} from './DateWheelPickerState'

const defaultPickerStart = DateUtils.subtractDuration(new Date(), { years: 100 })
const defaultPickerEnd = DateUtils.addDuration(new Date(), { years: 100 })

export type DateWheelPickerStateManagerProps = InputStateMangerProps<DateWheelPickerState, DateWheelPickerEvent> & {
  children?: ReactNode,
  start?: Date,
  end?: Date,
  isLooping?: boolean,
  loopingBehaviour?: WheelLoopingBehaviour,
}

export function DateWheelPickerStateManager({
  state,
  onStateChange,
  onStateEvent,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  start = defaultPickerStart,
  end = defaultPickerEnd,
  isLooping = true,
  loopingBehaviour = defaultWheelLoopingBehaviour,
  children,
}: DateWheelPickerStateManagerProps) {
  const { locale } = useLocalization()
  const monthNames = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale, { month: 'short' })
    return Array.from({ length: 12 }, (_, index) => formatter.format(new Date(2000, index, 1)))
  }, [locale])
  const bounds = useMemo(() => DateUtils.monthBounds(start, end), [end, start])
  const months = useMemo(
    () => DateUtils.monthsForYear(state.value.getFullYear(), bounds.minTimestamp, bounds.maxTimestamp),
    [bounds.maxTimestamp, bounds.minTimestamp, state.value]
  )
  const years = useMemo(() => DateUtils.yearsBetween(start, end), [end, start])
  const days = useMemo(
    () => daysForMonth(state.value, bounds.minTimestamp, bounds.maxTimestamp),
    [bounds.maxTimestamp, bounds.minTimestamp, state.value]
  )
  const transition = useMemo(() => {
    return (current: DateWheelPickerState, event: DateWheelPickerEvent) => dateWheelPickerStateTransition(current, event, {
      ...bounds,
      loopingBehaviour,
    })
  }, [bounds, loopingBehaviour])
  const config = useMemo<DateWheelPickerContextConfig>(() => ({
    ...dateInputConfig({ isInvalid, isDisabled, isReadOnly, isRequired }),
    isLooping,
    loopingBehaviour,
    monthNames,
    months,
    years,
    days,
  }), [days, isDisabled, isInvalid, isLooping, isReadOnly, isRequired, loopingBehaviour, monthNames, months, years])
  const contextValue = useDateStateMachine({
    state,
    transition,
    onStateChange,
    onStateEvent,
    config,
  })

  return (
    <DateWheelPickerContext.Provider value={contextValue}>
      {children}
    </DateWheelPickerContext.Provider>
  )
}
