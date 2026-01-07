import { List } from 'lucide-react'
import clsx from 'clsx'
import type { PropsWithChildren } from 'react'
import { PropertyBase } from '@/src/components/user-interaction/properties/PropertyBase'
import { Select } from '@/src/components/user-interaction/Select'

export type SingleSelectPropertyProps = PropertyField<string> & PropsWithChildren

/**
 * An Input for SingleSelect properties
 */
export const SingleSelectProperty = ({
  children,
  value,
  onValueChange,
  onEditComplete,
  ...props
}: SingleSelectPropertyProps) => {
  const hasValue = value !== undefined

  return (
    <PropertyBase
      {...props}
      hasValue={hasValue}
      icon={<List size={24}/>}
    >
      {({ softRequired }) => (
        <Select
          value={value}
          onValueChange={(value) => {
            onValueChange?.(value)
            onEditComplete?.(value)
          }}
          disabled={props.readOnly}
          buttonProps={{
            className: clsx(
              'default-style-none focus-style-none flex-row-2 w-full items-center',
              {
                '!bg-warning !text-surface-warning': softRequired && !hasValue,
              }
            ),
          }}
        >
          {children}
        </Select>
      )}
    </PropertyBase>
  )
}
