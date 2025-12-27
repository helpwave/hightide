import { CalendarDays } from 'lucide-react'
import clsx from 'clsx'
import { formatDate, formatDateTime } from '@/src/utils/date'
import { Input } from '@/src/components/user-interaction/input/Input'
import type { PropertyBaseProps } from './PropertyBase'
import { PropertyBase } from './PropertyBase'

export type DatePropertyProps = Omit<PropertyBaseProps, 'icon' | 'input' | 'hasValue'> & {
  value?: Date,
  onChange?: (date: Date) => void,
  onEditComplete?: (value: Date) => void,
  type?: 'dateTime' | 'date',
}

/**
 * An Input for date properties
 */
export const DateProperty = ({
  value,
  onChange,
  onEditComplete,
  readOnly,
  type = 'dateTime',
  ...baseProps
}: DatePropertyProps) => {
  const hasValue = !!value

  const dateText = value ? (type === 'dateTime' ? formatDateTime(value) : formatDate(value)) : ''
  return (
    <PropertyBase
      {...baseProps}
      hasValue={hasValue}
      icon={<CalendarDays size={24}/>}
      input={({ softRequired }) => (
        <Input
          className={clsx('default-style-none focus-style-none', { 'bg-surface-warning': softRequired && !hasValue })}
          value={dateText}
          type={type === 'dateTime' ? 'datetime-local' : 'date'}
          readOnly={readOnly}
          onChange={(event) => {
            const value = event.target.value
            if (!value) {
              event.preventDefault()
              return
            }
            const dueDate = new Date(value)
            onChange?.(dueDate)
          }}
          onEditCompleted={(value) => onEditComplete?.(new Date(value))}
        />
      )}
    />
  )
}
