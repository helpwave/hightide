import type { ReactNode } from 'react'
import { useMemo } from 'react'
import type { DOMInputStateMangerProps } from '../../domInput'
import { DateUtils } from '@helpwave/hightide-utils/utils'
import { useLocalization } from '../../../../global-contexts/localization/forward-exports'
import { dateInputConfig, useDateStateMachine } from '../useDateStateMachine'
import { YearMonthPickerContext, type YearMonthPickerContextConfig } from './YearMonthPickerContext'
import {
  yearMonthPickerStateTransition,
  type YearMonthPickerEvent,
  type YearMonthPickerState
} from './YearMonthPickerState'

const defaultPickerStart = DateUtils.subtractDuration(new Date(), { years: 100 })
const defaultPickerEnd = DateUtils.addDuration(new Date(), { years: 100 })

export type YearMonthPickerStateManagerProps = DOMInputStateMangerProps<YearMonthPickerState, YearMonthPickerEvent> & {
  children?: ReactNode,
  start?: Date,
  end?: Date,
}

export function YearMonthPickerStateManager({
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
  children,
}: YearMonthPickerStateManagerProps) {
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
  const transition = useMemo(() => {
    return (current: YearMonthPickerState, event: YearMonthPickerEvent) => yearMonthPickerStateTransition(current, event, bounds)
  }, [bounds])
  const config = useMemo<YearMonthPickerContextConfig>(() => ({
    ...dateInputConfig({ isInvalid, isDisabled, isReadOnly, isRequired, id }),
    monthNames,
    months,
    years,
  }), [isDisabled, isInvalid, isReadOnly, isRequired, monthNames, months, years, id])
  const contextValue = useDateStateMachine({
    state,
    transition,
    onStateChange,
    onStateEvent,
    config,
  })

  return (
    <YearMonthPickerContext.Provider value={contextValue}>
      {children}
    </YearMonthPickerContext.Provider>
  )
}
