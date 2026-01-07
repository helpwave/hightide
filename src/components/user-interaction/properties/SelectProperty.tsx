import { List } from 'lucide-react'
import type { PropsWithChildren } from 'react'
import type { PropertyField } from '@/src/components/user-interaction/properties/PropertyBase'
import { PropertyBase } from '@/src/components/user-interaction/properties/PropertyBase'
import { Select } from '@/src/components/user-interaction/Select'
import { PropsUtil } from '@/src/utils/propsUtil'

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
      {({ invalid }) => (
        <div
          data-name="property-input-wrapper"
          data-invalid={PropsUtil.dataAttributes.bool(invalid)}
        >
          <Select
            value={value}
            onValueChange={(value) => {
              onValueChange?.(value)
              onEditComplete?.(value)
            }}
            disabled={props.readOnly}
            buttonProps={{
              className: 'flex-row-2 w-full items-center justify-between p-1 border-0',
            }}
          >
            {children}
          </Select>
        </div>
      )}
    </PropertyBase>
  )
}
