import type { ComponentRef, Ref } from 'react'
import { useCallback } from 'react'
import type { ControllableDOMInputProps } from '../../domInput'
import { useControlledState, useStateMachineBinding } from '@helpwave/hightide-utils/hooks'
import type { Weekday } from '@helpwave/hightide-utils/utils'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { CalendarDayPickerContext } from './CalendarDayPickerContext'
import { CalendarDayPickerGrid } from './CalendarDayPickerGrid'
import { CalendarDayPickerHeader } from './CalendarDayPickerHeader'
import { CalendarDayPickerLayout, type CalendarDayPickerLayoutProps } from './CalendarDayPickerLayout'
import { CalendarDayPickerTrigger } from './CalendarDayPickerTrigger'
import { CalendarDayPickerStateManager } from './CalendarDayPickerStateManager'
import type { CalendarDayPickerEvent, CalendarDayPickerState } from './CalendarDayPickerState'

export type CalendarDayPickerProps = ControllableDOMInputProps<Date, CalendarDayPickerEvent> & {
  displayedMonth?: Date,
  changeDisplayedMonth?: (date: Date) => void,
  initialDisplayedMonth?: Date,
  start?: Date,
  end?: Date,
  weekStart?: Weekday,
  markToday?: boolean,
  layoutRef?: Ref<ComponentRef<typeof CalendarDayPickerLayout>>,
  layoutProps?: CalendarDayPickerLayoutProps,
}

const CalendarDayPickerComponent = ({
  value,
  initialValue = new Date(),
  onValueChange,
  onStateEvent,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  id,
  displayedMonth,
  changeDisplayedMonth,
  initialDisplayedMonth,
  start,
  end,
  weekStart,
  markToday,
  layoutRef,
  layoutProps,
}: CalendarDayPickerProps) => {
  const [state, setState] = useControlledState<CalendarDayPickerState>({
    defaultValue: {
      value: value ?? initialValue,
      displayedMonth: displayedMonth ?? initialDisplayedMonth ?? initialValue,
    },
  })
  const monthBinding = useStateMachineBinding<CalendarDayPickerState, Date>({
    state,
    onStateChange: setState,
    onValueChange: changeDisplayedMonth,
    value: displayedMonth,
    inject: useCallback((next: Date) => ({ displayedMonth: next }), []),
    get: useCallback((current: CalendarDayPickerState) => current.displayedMonth, []),
  })
  const binding = useStateMachineBinding<CalendarDayPickerState, Date>({
    state: monthBinding.state,
    onStateChange: monthBinding.onStateChange,
    onValueChange,
    value,
    inject: useCallback((next: Date) => ({ value: next }), []),
    get: useCallback((current: CalendarDayPickerState) => current.value, []),
  })

  return (
    <CalendarDayPickerStateManager
      state={binding.state}
      onStateChange={binding.onStateChange}
      onStateEvent={onStateEvent}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      id={id}
      start={start}
      end={end}
      weekStart={weekStart}
      markToday={markToday}
    >
      <CalendarDayPickerLayout
        ref={ReactUtils.assingRefsBuilder([layoutRef])}
        {...layoutProps}
      >
        <CalendarDayPickerHeader />
        <CalendarDayPickerGrid />
      </CalendarDayPickerLayout>
    </CalendarDayPickerStateManager>
  )
}

export const CalendarDayPicker = Object.assign(CalendarDayPickerComponent, {
  StateManager: CalendarDayPickerStateManager,
  Layout: CalendarDayPickerLayout,
  Header: CalendarDayPickerHeader,
  Grid: CalendarDayPickerGrid,
  Trigger: CalendarDayPickerTrigger,
  Context: CalendarDayPickerContext,
  Provider: CalendarDayPickerContext.Provider,
  Consumer: CalendarDayPickerContext.Consumer,
})
