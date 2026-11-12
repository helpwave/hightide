import type { ComponentRef, Ref } from 'react'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { DateTimeFieldContext } from './DateTimeFieldContext'
import { DateTimeFieldLayout, type DateTimeFieldLayoutProps } from './DateTimeFieldLayout'
import { DateTimeFieldStateManager, type DateTimeFieldStateManagerProps } from './DateTimeFieldStateManager'

export type DateTimeFieldProps = Omit<DateTimeFieldStateManagerProps, 'children'> & {
  layoutRef?: Ref<ComponentRef<typeof DateTimeFieldLayout>>,
  layoutProps?: DateTimeFieldLayoutProps,
}

const DateTimeFieldComponent = ({
  layoutRef,
  layoutProps,
  ...props
}: DateTimeFieldProps) => {
  return (
    <DateTimeFieldStateManager {...props}>
      <DateTimeFieldLayout
        {...layoutProps}
        ref={ReactUtils.assingRefsBuilder([layoutRef])}
      />
    </DateTimeFieldStateManager>
  )
}

export const DateTimeField = Object.assign(DateTimeFieldComponent, {
  StateManager: DateTimeFieldStateManager,
  Layout: DateTimeFieldLayout,
  Context: DateTimeFieldContext,
  Provider: DateTimeFieldContext.Provider,
  Consumer: DateTimeFieldContext.Consumer,
})
