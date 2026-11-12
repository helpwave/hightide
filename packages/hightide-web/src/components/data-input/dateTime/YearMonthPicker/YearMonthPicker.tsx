import type { ComponentRef, Ref } from 'react'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { YearMonthPickerContext } from './YearMonthPickerContext'
import { YearMonthPickerLayout, type YearMonthPickerLayoutProps } from './YearMonthPickerLayout'
import { YearMonthPickerMonthWheel } from './YearMonthPickerMonthWheel'
import { YearMonthPickerYearWheel } from './YearMonthPickerYearWheel'
import { YearMonthPickerStateManager, type YearMonthPickerStateManagerProps } from './YearMonthPickerStateManager'

export type YearMonthPickerProps = Omit<YearMonthPickerStateManagerProps, 'children'> & {
  start?: Date,
  end?: Date,
  layoutRef?: Ref<ComponentRef<typeof YearMonthPickerLayout>>,
  layoutProps?: YearMonthPickerLayoutProps,
}

const YearMonthPickerComponent = ({
  value,
  initialValue = new Date(),
  onValueChange,
  onStateEvent,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  id,
  start,
  end,
  layoutRef,
  layoutProps,
}: YearMonthPickerProps) => {

  return (
    <YearMonthPickerStateManager
      value={value}
      initialValue={initialValue}
      onValueChange={onValueChange}
      onStateEvent={onStateEvent}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      id={id}
      start={start}
      end={end}
    >
      <YearMonthPickerLayout
        ref={ReactUtils.assingRefsBuilder([layoutRef])}
        {...layoutProps}
      >
        <YearMonthPickerMonthWheel />
        <YearMonthPickerYearWheel />
      </YearMonthPickerLayout>
    </YearMonthPickerStateManager>
  )
}

export const YearMonthPicker = Object.assign(YearMonthPickerComponent, {
  StateManager: YearMonthPickerStateManager,
  Layout: YearMonthPickerLayout,
  MonthWheel: YearMonthPickerMonthWheel,
  YearWheel: YearMonthPickerYearWheel,
  Context: YearMonthPickerContext,
  Provider: YearMonthPickerContext.Provider,
  Consumer: YearMonthPickerContext.Consumer,
})
