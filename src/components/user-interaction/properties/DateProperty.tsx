import { CalendarDays } from 'lucide-react'
import { PropertyBase, type PropertyField } from './PropertyBase'
import { DateTimeInput } from '../input/DateTimeInput'
import { PropsUtil } from '@/src/utils/propsUtil'

export type DatePropertyProps = PropertyField<Date>
& {
  type?: 'dateTime' | 'date',
}

/**
 * An Input for date properties
 */
export const DateProperty = ({
  value,
  onValueChange,
  onEditComplete,
  readOnly,
  type = 'dateTime',
  ...baseProps
}: DatePropertyProps) => {
  const hasValue = !!value

  return (
    <PropertyBase
      {...baseProps}
      hasValue={hasValue}
      icon={<CalendarDays size={24}/>}
    >
      {({ invalid }) => (
        <DateTimeInput
          value={value}
          mode={type}
          readOnly={readOnly}
          onValueChange={onValueChange}
          onEditComplete={onEditComplete}
          className="property-input"
          data-invalid={PropsUtil.dataAttributes.bool(invalid)}
        />
      )}
    </PropertyBase>
  )
}
