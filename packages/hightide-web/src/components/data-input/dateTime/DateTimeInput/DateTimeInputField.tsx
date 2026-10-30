import type { ComponentRef, Ref } from 'react'
import { DateUtils } from '@helpwave/hightide-utils/utils'
import { DateTimeField, type DateTimeFieldProps } from '../DateTimeField'
import { useDateTimeInputContext } from './DateTimeInputContext'

export type DateTimeInputFieldProps = Omit<DateTimeFieldProps, 'value' | 'onValueChange' | 'onStateEvent' | 'mode' | 'precision' | 'is24HourFormat'> & {
  fieldRef?: Ref<ComponentRef<typeof DateTimeField.Layout>>,
}

export function DateTimeInputField({ fieldRef, ...props }: DateTimeInputFieldProps) {
  const { state, dispatch, config, mode, precision, timeZone, is24HourFormat } = useDateTimeInputContext()

  return (
    <DateTimeField
      {...props}
      layoutRef={fieldRef}
      value={DateUtils.toZonedDate(state.value, timeZone)}
      mode={mode}
      precision={precision}
      is24HourFormat={is24HourFormat}
      isDisabled={config.isDisabled}
      isReadOnly={config.isReadOnly}
      isInvalid={config.isInvalid}
      isRequired={config.isRequired}
      id={config.id}
      onValueChange={(next) => dispatch({ type: 'setValue', value: DateUtils.fromZonedDate(next, timeZone) })}
      onStateEvent={(event) => {
        if (event.type === 'commit') {
          dispatch({ type: 'commit', value: DateUtils.fromZonedDate(event.value, timeZone) })
        }
      }}
    />
  )
}
