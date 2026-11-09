import { useMemo } from 'react'
import type { DOMInputStateMangerProps } from '../../domInput'
import { DateUtils } from '@helpwave/hightide-utils/utils'
import { useLocalization } from '../../../../global-contexts/localization/forward-exports'
import { useStateMachine } from '@helpwave/hightide-utils/hooks'
import { dateInputConfig } from '../useDateStateMachine'
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

export type DateWheelPickerStateManagerProps = DOMInputStateMangerProps<DateWheelPickerState, DateWheelPickerEvent> & {
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
  id,
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
  const years = useMemo(() => DateUtils.yearsBetween(start, end), [end, start])
  const transition = useMemo(() => {
    return (current: DateWheelPickerState, event: DateWheelPickerEvent) => dateWheelPickerStateTransition(current, event, {
      ...bounds,
      loopingBehaviour,
    })
  }, [bounds, loopingBehaviour])
  const machine = useStateMachine({
    state,
    transition,
    onStateChange,
    onStateEvent,
  })
  const months = useMemo(
    () => DateUtils.monthsForYear(machine.state.value.getFullYear(), bounds.minTimestamp, bounds.maxTimestamp),
    [bounds.maxTimestamp, bounds.minTimestamp, machine.state.value]
  )
  const days = useMemo(
    () => daysForMonth(machine.state.value, bounds.minTimestamp, bounds.maxTimestamp),
    [bounds.maxTimestamp, bounds.minTimestamp, machine.state.value]
  )
  const config = useMemo<DateWheelPickerContextConfig>(() => ({
    ...dateInputConfig({ isInvalid, isDisabled, isReadOnly, isRequired, id }),
    isLooping,
    loopingBehaviour,
    monthNames,
    months,
    years,
    days,
  }), [days, isDisabled, isInvalid, isLooping, isReadOnly, isRequired, loopingBehaviour, monthNames, months, years, id])
  const contextValue = useMemo(() => ({
    state: machine.state,
    dispatch: machine.dispatch,
    config,
  }), [config, machine.dispatch, machine.state])

  return (
    <DateWheelPickerContext.Provider value={contextValue}>
      {children}
    </DateWheelPickerContext.Provider>
  )
}
