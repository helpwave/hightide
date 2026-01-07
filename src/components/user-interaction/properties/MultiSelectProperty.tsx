import { List } from 'lucide-react'
import { PropertyBase, PropertyField } from '@/src/components/user-interaction/properties/PropertyBase'
import { MultiSelectChipDisplay } from '@/src/components/user-interaction/Select'
import type { PropsWithChildren } from 'react'
import { PropsUtil } from '@/src/utils/propsUtil'

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
      {({ invalid }) => (
        <div
          data-name="property-input-wrapper"
          data-invalid={PropsUtil.dataAttributes.bool(invalid)}
        >
          <MultiSelectChipDisplay
            value={value}
            onValueChange={(value) => {
              onValueChange?.(value)
              onEditComplete?.(value)
            }}
            disabled={props.readOnly}
            contentPanelProps={{
              className: '!border-none !min-h-10'
            }}
            chipDisplayProps={{
              className: 'flex flex-wrap gap-x-2 gap-y-2 p-0 items-center hover:cursor-pointer border-0',
            }}
          >
            {children}
          </MultiSelectChipDisplay>
        </div>
      )}
    </PropertyBase>
  )
}
