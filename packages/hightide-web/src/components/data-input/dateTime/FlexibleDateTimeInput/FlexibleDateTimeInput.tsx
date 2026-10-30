import type { ReactNode } from 'react'
import { useCallback, useEffect, useRef } from 'react'
import { DateUtils } from '@helpwave/hightide-utils/utils'
import type { ControllableDOMInputProps } from '../../domInput'
import { useControlledState, useStableEvent, useStateMachineBinding } from '@helpwave/hightide-utils/hooks'
import { useLocalization } from '../../../../global-contexts/localization/forward-exports'
import type { DateTimeInputProps } from '../DateTimeInput'
import { DateTimeInput } from '../DateTimeInput'
import { FlexibleDateTimeInputContext } from './FlexibleDateTimeInputContext'
import { FlexibleDateTimeInputInput } from './FlexibleDateTimeInputInput'
import { FlexibleDateTimeInputModeButton } from './FlexibleDateTimeInputModeButton'
import { FlexibleDateTimeInputStateManager } from './FlexibleDateTimeInputStateManager'
import type { FlexibleDateTimeInputEvent, FlexibleDateTimeInputState, FlexibleDateTimeMode } from './FlexibleDateTimeInputState'

export type FlexibleDateTimeInputProps = Omit<DateTimeInputProps, 'mode' | 'actions' | 'onStateEvent' | 'onValueChange'>
  & ControllableDOMInputProps<Date | null, FlexibleDateTimeInputEvent>
  & {
    defaultMode?: FlexibleDateTimeMode,
    fixedTime?: Date | null,
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
  defaultMode = 'date',
  fixedTime: fixedTimeOverride,
  timeZone: timeZoneOverride,
  actions = [],
  ...props
}: FlexibleDateTimeInputProps) => {
  const { timeZone: contextTimeZone } = useLocalization()
  const timeZone = timeZoneOverride ?? contextTimeZone
  const fixedTime = fixedTimeOverride ?? new Date(1970, 0, 1, 23, 59, 59, 999)
  const zoned = (date: Date) => DateUtils.toZonedDate(date, timeZone)
  const hasFixedTime = (date: Date) => DateUtils.sameTime(zoned(date), fixedTime, true, true)
  const initialMode: FlexibleDateTimeMode = initialValue && !hasFixedTime(initialValue) ? 'dateTime' : defaultMode
  const [state, setState] = useControlledState<FlexibleDateTimeInputState>({
    defaultValue: {
      value: initialValue ?? null,
      mode: initialMode,
    },
  })
  const notifyValueChange = useStableEvent(onValueChange)
  const previousValueRef = useRef<Date | null>(value ?? initialValue ?? null)
  useEffect(() => {
    if (value !== undefined) previousValueRef.current = value
  }, [value])
  const onStateChange = useCallback((next: FlexibleDateTimeInputState) => {
    setState(next)
    if (next.value !== previousValueRef.current) {
      previousValueRef.current = next.value
      notifyValueChange(next.value)
    }
  }, [notifyValueChange, setState])
  const binding = useStateMachineBinding<FlexibleDateTimeInputState, Date | null>({
    state,
    onStateChange,
    value,
    inject: useCallback((next: Date | null) => ({ value: next }), []),
    get: useCallback((current: FlexibleDateTimeInputState) => current.value, []),
  })

  return (
    <FlexibleDateTimeInputStateManager
      state={binding.state}
      onStateChange={binding.onStateChange}
      onStateEvent={onStateEvent}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      id={id}
    >
      <FlexibleDateTimeInputInput
        {...props}
        timeZone={timeZone}
        fixedTime={fixedTime}
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
