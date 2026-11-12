import type { ReactNode } from 'react'
import type { DateTimeInputProps } from '../DateTimeInput'
import { DateTimeInput } from '../DateTimeInput'
import { FlexibleDateTimeInputContext } from './FlexibleDateTimeInputContext'
import { FlexibleDateTimeInputInput } from './FlexibleDateTimeInputInput'
import { FlexibleDateTimeInputModeButton } from './FlexibleDateTimeInputModeButton'
import { FlexibleDateTimeInputStateManager, type FlexibleDateTimeInputStateManagerProps } from './FlexibleDateTimeInputStateManager'

export type FlexibleDateTimeInputProps = Omit<DateTimeInputProps, 'mode' | 'actions' | 'onStateEvent' | 'onValueChange'>
  & Omit<FlexibleDateTimeInputStateManagerProps, 'children'>
  & {
    actions?: ReactNode[],
  }

const FlexibleDateTimeInputComponent = ({
  value,
  initialValue,
  onValueChange,
  onStateEvent,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  id,
  defaultMode,
  fixedTime,
  timeZone,
  actions = [],
  ...props
}: FlexibleDateTimeInputProps) => {
  return (
    <FlexibleDateTimeInputStateManager
      value={value}
      initialValue={initialValue}
      onValueChange={onValueChange}
      onStateEvent={onStateEvent}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      id={id}
      defaultMode={defaultMode}
      timeZone={timeZone}
      fixedTime={fixedTime}
    >
      <FlexibleDateTimeInputInput
        {...props}
        actions={actions}
      />
    </FlexibleDateTimeInputStateManager>
  )
}

export const FlexibleDateTimeInput = Object.assign(FlexibleDateTimeInputComponent, {
  StateManager: FlexibleDateTimeInputStateManager,
  Input: DateTimeInput,
  ModeButton: FlexibleDateTimeInputModeButton,
  Context: FlexibleDateTimeInputContext,
  Provider: FlexibleDateTimeInputContext.Provider,
  Consumer: FlexibleDateTimeInputContext.Consumer,
})
