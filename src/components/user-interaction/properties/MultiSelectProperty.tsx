import { List } from 'lucide-react'
import clsx from 'clsx'
import { PropertyBase, PropertyField } from '@/src/components/user-interaction/properties/PropertyBase'
import { MultiSelectChipDisplay } from '@/src/components/user-interaction/Select'
import type { PropsWithChildren } from 'react'

export type MultiSelectPropertyProps = PropertyField<string[]> & PropsWithChildren
/**
 * An Input for MultiSelect properties
 */
export const MultiSelectProperty = ({
  children,
  value,
  onValueChange,
  onEditComplete,
  ...props
}: MultiSelectPropertyProps) => {
  const hasValue = value.length > 0

  return (
    <PropertyBase
      {...props}
      hasValue={hasValue}
      icon={<List size={24}/>}
    >
      {({ softRequired }) => (
        <MultiSelectChipDisplay
          value={value}
          onValueChange={(value) => {
            onValueChange?.(value)
            onEditComplete?.(value)
          }}
          disabled={props.readOnly}
          contentPanelProps={{
            className: clsx(
              '!border-none !min-h-10'
            )
          }}
          chipDisplayProps={{
            className: clsx(
              'default-style-none flex flex-wrap gap-x-2 gap-y-2 items-center hover:cursor-pointer',
              { '!bg-warning text-surface-warning': softRequired && !hasValue }
            )
          }}
        >
          {children}
        </MultiSelectChipDisplay>
      )}
    </PropertyBase>
  )
}
