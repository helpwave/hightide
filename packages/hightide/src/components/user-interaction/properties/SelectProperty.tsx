import { List } from 'lucide-react'
import type { PropsWithChildren } from 'react'
import type { PropertyField } from './PropertyBase'
import { PropertyBase } from './PropertyBase'
import { PropsUtil } from '../../../utils/propsUtil'
import { SelectRoot } from '../Select/SelectRoot'
import { SelectButton } from '../Select/SelectButton'
import { SelectContent } from '../Select/SelectContent'

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
