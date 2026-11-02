import type { ReactNode } from 'react'
import { DateUtils } from '@helpwave/hightide-utils/utils'
import { DateTimeInput, type DateTimeInputProps } from '../DateTimeInput'
import { useFlexibleDateTimeInputContext } from './FlexibleDateTimeInputContext'
import { FlexibleDateTimeInputModeButton } from './FlexibleDateTimeInputModeButton'

export type FlexibleDateTimeInputInputProps = Omit<DateTimeInputProps, 'mode' | 'value' | 'onValueChange' | 'onStateEvent' | 'actions'> & {
  timeZone: string,
  fixedTime: Date,
  actions?: ReactNode[],
}

export function FlexibleDateTimeInputInput({
  timeZone,
  fixedTime,
  actions = [],
  ...props
}: FlexibleDateTimeInputInputProps) {
  const { state, dispatch, config } = useFlexibleDateTimeInputContext()
  const zoned = (date: Date) => DateUtils.toZonedDate(date, timeZone)
  const unzoned = (date: Date) => DateUtils.fromZonedDate(date, timeZone)
  const toDate = (date: Date) => unzoned(DateUtils.withTime(zoned(date), fixedTime))

  return (
    <DateTimeInput
      {...props}
      timeZone={timeZone}
      mode={state.mode}
      value={state.value}
      isInvalid={config.isInvalid}
      isDisabled={config.isDisabled}
      isReadOnly={config.isReadOnly}
      isRequired={config.isRequired}
      id={config.id}
      onValueChange={(next) => {
        const adjusted = next === null ? null : (state.mode === 'date' ? toDate(next) : next)
        dispatch({ type: 'setValue', value: adjusted, mode: state.mode })
      }}
      onStateEvent={(event) => {
        if (event.type === 'commit') {
          dispatch({ type: 'commit', value: event.value, mode: state.mode })
        }
      }}
      actions={[
        ...actions,
        <FlexibleDateTimeInputModeButton key="flexible-date-time-mode" timeZone={timeZone} fixedTime={fixedTime} />,
      ]}
    />
  )
}
