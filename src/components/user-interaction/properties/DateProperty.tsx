import { CalendarDays } from 'lucide-react'
import clsx from 'clsx'
import { PropertyField } from './PropertyField'
import { DateTimeInput } from '../input/DateTimeInput'

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
    <PropertyField
      {...baseProps}
      hasValue={hasValue}
      icon={<CalendarDays size={24}/>}
    >
      {({ softRequired }) => (
        <DateTimeInput
          value={value}
          mode={type}
          readOnly={readOnly}

          onValueChange={onValueChange}
          onEditComplete={onEditComplete}

          className={clsx('default-style-none focus-style-none', { 'bg-surface-warning': softRequired && !hasValue })}
        />
      )}
    </PropertyField>
  )
}
