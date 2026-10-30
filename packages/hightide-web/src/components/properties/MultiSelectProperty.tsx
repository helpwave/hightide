import { List } from 'lucide-react'
import { Icon } from '../visualization/Icon'
import { PropertyBase, type PropertyField } from './PropertyBase'
import { PropsUtil } from '../../utils/propsUtil'
import { MultiSelect } from '../data-input/selection/MultiSelect/MultiSelect'
import type { MultiSelectEvent } from '../data-input/selection/MultiSelect/MultiSelectStateManager'
import type { SelectionOptionInput } from '../data-input/selection/option'

export interface MultiSelectPropertyProps extends PropertyField<string[], MultiSelectEvent<string>> {
  options: ReadonlyArray<SelectionOptionInput<string>>,
}

export const MultiSelectProperty = ({
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
            options={options}
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
            id={id}
          >
            <MultiSelect.ChipDisplayTrigger
              className="flex flex-wrap gap-x-2 gap-y-2 p-0 items-center hover:cursor-pointer border-0"
            />
            <MultiSelect.PopUp className="!border-none !min-h-10">
              <MultiSelect.Searchbar />
              <MultiSelect.List />
            </MultiSelect.PopUp>
          </MultiSelect.StateManager>
        </div>
      )}
    </PropertyBase>
  )
}
