import clsx from 'clsx'
import { CalendarDays } from 'lucide-react'
import { Icon } from '../visualization/Icon'
import { PropertyBase, type PropertyField } from './PropertyBase'
import { DateTimeInput, type DateTimeInputProps } from '../data-input/dateTime/DateTimeInput'
import { PropsUtil } from '../../utils/propsUtil'

export type DatePropertyProps =
  Pick<PropertyField<Date | null>, 'name' | 'onRemove' | 'onValueClear'>
  & Omit<DateTimeInputProps, 'mode' | 'allowRemove'>
  & {
    type?: 'dateTime' | 'date',
    allowRemove?: boolean,
    required?: boolean,
    readOnly?: boolean,
    className?: string,
  }

export const DateProperty = ({
  name,
  value,
  onValueChange,
  onStateEvent,
  onRemove,
  onValueClear,
  required,
  readOnly,
  allowClear = true,
  allowRemove = true,
  type = 'dateTime',
  className,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  controlProps,
  ...inputProps
}: DatePropertyProps) => {
  const hasValue = !!value

  return (
    <PropertyBase
      name={name}
      required={required}
      readOnly={readOnly}
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
          mode={type}
          isInvalid={isInvalid ?? invalid}
          isDisabled={isDisabled}
          isReadOnly={isReadOnly ?? readOnly}
          isRequired={isRequired ?? required}
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
