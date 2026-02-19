import { List } from 'lucide-react'
import type { PropsWithChildren } from 'react'
import type { PropertyField } from '@/src/components/user-interaction/properties/PropertyBase'
import { PropertyBase } from '@/src/components/user-interaction/properties/PropertyBase'
import { PropsUtil } from '@/src/utils/propsUtil'
import { SelectRoot } from '@/src/components/user-interaction/select/SelectContext'
import { SelectButton } from '@/src/components/user-interaction/select/SelectButton'
import { SelectContent } from '@/src/components/user-interaction/select/SelectContent'

export interface SingleSelectPropertyProps extends PropertyField<string>, PropsWithChildren {}

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
          <SelectRoot
            value={value}
            onValueChange={(value) => {
              onValueChange?.(value)
              onEditComplete?.(value)
            }}
            disabled={props.readOnly}
          >
            <SelectButton
              className="flex-row-2 w-full items-center justify-between"
              hideExpansionIcon={true} data-name="property-input"
            />
            <SelectContent>{children}</SelectContent>
          </SelectRoot>
        </div>
      )}
    </PropertyBase>
  )
}
