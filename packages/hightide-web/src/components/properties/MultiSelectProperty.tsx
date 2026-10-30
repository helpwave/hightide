import { List } from 'lucide-react'
import { Icon } from '../visualization/Icon'
import { PropertyBase, type PropertyField } from './PropertyBase'
import type { PropsWithChildren } from 'react'
import { PropsUtil } from '../../utils/propsUtil'
import { MultiSelect } from '../data-input/selection/MultiSelect/MultiSelect'
import type { MultiSelectEvent } from '../data-input/selection/MultiSelect/MultiSelectStateManager'

export interface MultiSelectPropertyProps extends PropertyField<string[], MultiSelectEvent<string>>, PropsWithChildren {}

export const MultiSelectProperty = ({
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
}: MultiSelectPropertyProps) => {
  const hasValue = value !== undefined && value.length > 0

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
          <MultiSelect.StateManager
            value={value}
            initialValue={initialValue}
            onValueChange={(val) => {
              const arr = val as string[]
              onValueChange?.(arr)
              onEditComplete?.(arr)
            }}
            onStateEvent={onStateEvent}
            isInvalid={invalid}
            isDisabled={isDisabled}
            isReadOnly={isReadOnly}
            isRequired={isRequired}
          >
            <MultiSelect.ChipDisplayTrigger
              className="flex flex-wrap gap-x-2 gap-y-2 p-0 items-center hover:cursor-pointer border-0"
            />
            <MultiSelect.Content className="!border-none !min-h-10">
              {children}
            </MultiSelect.Content>
          </MultiSelect.StateManager>
        </div>
      )}
    </PropertyBase>
  )
}
