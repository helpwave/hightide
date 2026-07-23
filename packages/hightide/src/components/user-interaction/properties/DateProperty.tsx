import { CalendarDays } from 'lucide-react'
import { PropertyBase, type PropertyField } from './PropertyBase'
import { DateTimeInput, type DateTimeInputProps } from '../input/DateTimeInput'
import { PropsUtil } from '../../../utils/propsUtil'

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
  onValueChange,
  onEditComplete,
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
      icon={<CalendarDays size={24}/>}
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
          onValueChange={onValueChange}
          onEditComplete={onEditComplete}
          data-name="property-input"
          className="flex-row-4 pr-0"
          data-invalid={PropsUtil.dataAttributes.bool(invalid)}
        />
      )}
    </PropertyBase>
  )
}
