import clsx from 'clsx'
import { CalendarDays } from 'lucide-react'
import { Icon } from '../visualization/Icon'
import { PropertyBase, type PropertyField } from './PropertyBase'
import { DateTimeInput, type DateTimeInputProps } from '../data-input/dateTime/DateTimeInput'
import type { DateTimeInputEvent } from '../data-input/dateTime/DateTimeInput'
import { PropsUtil } from '../../utils/propsUtil'

export type DatePropertyProps =
  PropertyField<Date | null, DateTimeInputEvent>
  & Omit<DateTimeInputProps, 'mode' | 'allowRemove' | keyof PropertyField<Date | null, DateTimeInputEvent>>
  & {
    type?: 'dateTime' | 'date',
    allowRemove?: boolean,
    className?: string,
  }

export const DateProperty = ({
  name,
  value,
  initialValue,
  onValueChange,
  onStateEvent,
  onRemove,
  onValueClear,
  onEditComplete: _onEditComplete,
  isRequired,
  id,
  isReadOnly,
  isInvalid,
  isDisabled,
  allowClear = true,
  allowRemove = true,
  type = 'dateTime',
  className,
  controlProps,
  ...inputProps
}: DatePropertyProps) => {
  const hasValue = !!value

  return (
    <PropertyBase
      name={name}
      isRequired={isRequired}
      isReadOnly={isReadOnly}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      allowClear={allowClear}
      allowRemove={allowRemove}
      onRemove={onRemove}
      onValueClear={onValueClear ?? (() => {
        onValueChange?.(null)
        onStateEvent?.({ type: 'commit', value: null })
      })}
      hasValue={hasValue}
      icon={<Icon icon={CalendarDays} />}
      className={className}
    >
      {({ invalid }) => (
        <DateTimeInput
          {...inputProps}
          value={value}
          initialValue={initialValue}
          mode={type}
          isInvalid={invalid}
          isDisabled={isDisabled}
          isReadOnly={isReadOnly}
          isRequired={isRequired}
          id={id}
          allowClear={false}
          onValueChange={onValueChange}
          onStateEvent={onStateEvent}
          controlProps={{
            ...controlProps,
            className: clsx('property-input flex-row-4 pr-0', controlProps?.className),
            ...{ 'data-invalid': PropsUtil.dataAttributes.bool(invalid) },
          }}
        />
      )}
    </PropertyBase>
  )
}
