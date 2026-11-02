import { List } from 'lucide-react'
import { Icon } from '../visualization/Icon'
import type { PropertyField } from './PropertyBase'
import { PropertyBase } from './PropertyBase'
import { PropsUtil } from '../../utils/propsUtil'
import { Select } from '../data-input/selection/Select/Select'
import type { SelectEvent } from '../data-input/selection/Select/SelectStateManager'
import type { SelectionOptionInput } from '../data-input/selection/option'

export interface SingleSelectPropertyProps extends PropertyField<string, SelectEvent<string>> {
  options: ReadonlyArray<SelectionOptionInput<string>>,
}

export const SingleSelectProperty = ({
  options,
  value,
  initialValue,
  onValueChange,
  onStateEvent,
  onEditComplete,
  isReadOnly,
  isDisabled,
  isInvalid,
  isRequired,
  id,
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
            options={options}
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
            id={id}
          >
            <Select.Trigger
              className="property-input flex-row-2 w-full items-center justify-between"
              hideExpansionIcon={true}
            />
            <Select.PopUp>
              <Select.Searchbar />
              <Select.List />
            </Select.PopUp>
          </Select.StateManager>
        </div>
      )}
    </PropertyBase>
  )
}
