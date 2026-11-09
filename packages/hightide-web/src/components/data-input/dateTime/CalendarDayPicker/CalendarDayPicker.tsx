import type { ComponentRef, Ref } from 'react'
import type { ControllableDOMInputProps } from '../../domInput'
import { useControllableStateStore, useStateStoreBinding } from '@helpwave/hightide-utils/hooks'
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
  const { store, onStateChange } = useControllableStateStore<CalendarDayPickerState>({
    initialState: {
      value: value ?? initialValue,
      displayedMonth: displayedMonth ?? initialDisplayedMonth ?? initialValue,
    },
  })
  useStateStoreBinding({
    store,
    key: 'displayedMonth',
    value: displayedMonth,
    onValueChange: changeDisplayedMonth,
  })
  useStateStoreBinding({
    store,
    key: 'value',
    value,
    onValueChange,
  })

  return (
    <CalendarDayPickerStateManager
      state={store}
      onStateChange={onStateChange}
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
