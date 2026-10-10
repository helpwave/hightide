import { List } from 'lucide-react'
import { Icon } from '../visualization/Icon'
import type { PropsWithChildren } from 'react'
import type { PropertyField } from './PropertyBase'
import { PropertyBase } from './PropertyBase'
import { PropsUtil } from '../../utils/propsUtil'
import { Select } from '../data-input/Select/Select'

export interface SingleSelectPropertyProps extends PropertyField<string>, PropsWithChildren {}

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
      icon={<Icon icon={List} />}
    >
      {({ invalid }) => (
        <div
          className="property-input-wrapper"
          data-invalid={PropsUtil.dataAttributes.bool(invalid)}
        >
          <Select.Root
            value={value}
            onValueUpdate={(value) => {
              onValueChange?.(value)
              onEditComplete?.(value)
            }}
            disabled={props.readOnly}
          >
            <Select.Trigger
              className="property-input flex-row-2 w-full items-center justify-between"
              hideExpansionIcon={true}
            />
            <Select.Content>{children}</Select.Content>
          </Select.Root>
        </div>
      )}
    </PropertyBase>
  )
}
