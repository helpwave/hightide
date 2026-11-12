import { useMemo } from 'react'
import { DateUtils } from '@helpwave/hightide-utils/utils'
import { useInputStateManager } from '@helpwave/hightide-utils/hooks'
import { useLocalization } from '../../../../global-contexts/localization/forward-exports'
import type { DOMInputStateManagerProps } from '../../domInput'
import { FlexibleDateTimeInputContext, type FlexibleDateTimeInputContextValue } from './FlexibleDateTimeInputContext'
import {
  flexibleDateTimeInputStateTransition,
  type FlexibleDateTimeInputEvent,
  type FlexibleDateTimeInputState,
  type FlexibleDateTimeMode
} from './FlexibleDateTimeInputState'

export type FlexibleDateTimeInputStateManagerProps = DOMInputStateManagerProps<FlexibleDateTimeInputState, FlexibleDateTimeInputEvent> & {
  defaultMode?: FlexibleDateTimeMode,
  timeZone?: string,
  fixedTime?: Date | null,
}

export function FlexibleDateTimeInputStateManager({
  state,
  value,
  initialValue,
  onValueChange,
  onStateChange,
  onStateEvent,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  id,
  defaultMode = 'date',
  timeZone: timeZoneOverride,
  fixedTime: fixedTimeOverride,
  children,
}: FlexibleDateTimeInputStateManagerProps) {
  const { timeZone: contextTimeZone } = useLocalization()
  const timeZone = timeZoneOverride ?? contextTimeZone
  const fixedTime = useMemo(
    () => fixedTimeOverride ?? new Date(1970, 0, 1, 23, 59, 59, 999),
    [fixedTimeOverride]
  )
  const initialMode = useMemo<FlexibleDateTimeMode>(() => {
    if (!initialValue) return defaultMode
    const zoned = DateUtils.toZonedDate(initialValue, timeZone)
    const hasFixedTime = DateUtils.sameTime(zoned, fixedTime, true, true)
    return hasFixedTime ? defaultMode : 'dateTime'
  }, [defaultMode, fixedTime, initialValue, timeZone])
  const machine = useInputStateManager({
    state,
    value,
    initialValue,
    onValueChange,
    initialState: (seeded) => ({
      value: seeded ?? null,
      mode: initialMode,
    }),
    transition: flexibleDateTimeInputStateTransition,
    onStateChange,
    onStateEvent,
  })
  const config = useMemo(() => ({
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
    id,
  }), [isDisabled, isInvalid, isReadOnly, isRequired, id])
  const contextValue = useMemo<FlexibleDateTimeInputContextValue>(() => ({
    state: machine.state,
    dispatch: machine.dispatch,
    config,
    timeZone,
    fixedTime,
  }), [config, fixedTime, machine.dispatch, machine.state, timeZone])

  return (
    <FlexibleDateTimeInputContext.Provider value={contextValue}>
      {children}
    </FlexibleDateTimeInputContext.Provider>
  )
}
