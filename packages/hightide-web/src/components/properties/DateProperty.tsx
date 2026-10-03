import { CalendarDays } from 'lucide-react'
import { Icon } from '../visualization/Icon'
import { PropertyBase, type PropertyField } from './PropertyBase'
import { DateTimeInput, type DateTimeInputProps } from '../data-input/input/DateTimeInput'
import { PropsUtil } from '../../utils/propsUtil'

export type DatePropertyProps =
  Pick<PropertyField<Date | null>, 'name' | 'onRemove' | 'onValueClear'>
  & Omit<DateTimeInputProps, 'mode' | 'allowRemove'>
  & {
    type?: 'dateTime' | 'date',
    allowRemove?: boolean,
  }

export const DateProperty = ({
  name,
  value,
  onValueUpdate: onValueChange,
  onValueCommit: onEditComplete,
  onRemove,
  onValueClear,
  required,
  readOnly,
  allowClear = true,
  allowRemove = true,
  type = 'dateTime',
  className,
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
        onEditComplete?.(null)
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
          required={required}
          readOnly={readOnly}
          allowClear={false}
          onValueUpdate={onValueChange}
          onValueCommit={onEditComplete}
          className="property-input flex-row-4 pr-0"
          data-invalid={PropsUtil.dataAttributes.bool(invalid)}
        />
      )}
    </PropertyBase>
  )
}
