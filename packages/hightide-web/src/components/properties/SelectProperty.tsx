import { List } from 'lucide-react'
import { Icon } from '../visualization/Icon'
import type { PropsWithChildren } from 'react'
import type { PropertyField } from './PropertyBase'
import { PropertyBase } from './PropertyBase'
import { PropsUtil } from '../../utils/propsUtil'
import { Select } from '../data-input/selection/Select/Select'
import type { SelectEvent } from '../data-input/selection/Select/SelectStateManager'

export interface SingleSelectPropertyProps extends PropertyField<string, SelectEvent<string>>, PropsWithChildren {}

export const SingleSelectProperty = ({
  children,
  value,
  initialValue,
  onValueChange,
  onStateEvent,
  onEditComplete,
  isReadOnly,
  isDisabled,
  isInvalid,
  isRequired,
  ...props
}: SingleSelectPropertyProps) => {
  const hasValue = value !== undefined

  return (
    <PropertyBase
      {...props}
      hasValue={hasValue}
      isReadOnly={isReadOnly}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      isRequired={isRequired}
      icon={<Icon icon={List} />}
    >
      {({ invalid }) => (
        <div
          className="property-input-wrapper"
          data-invalid={PropsUtil.dataAttributes.bool(invalid)}
        >
          <Select.StateManager
            value={value}
            initialValue={initialValue}
            onValueChange={(next) => {
              onValueChange?.(next)
              onEditComplete?.(next)
            }}
            onStateEvent={onStateEvent}
            isInvalid={invalid}
            isDisabled={isDisabled}
            isReadOnly={isReadOnly}
            isRequired={isRequired}
          >
            <Select.Trigger
              className="property-input flex-row-2 w-full items-center justify-between"
              hideExpansionIcon={true}
            />
            <Select.Content>{children}</Select.Content>
          </Select.StateManager>
        </div>
      )}
    </PropertyBase>
  )
}
