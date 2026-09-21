import { List } from 'lucide-react'
import { PropertyBase, type PropertyField } from './PropertyBase'
import type { PropsWithChildren } from 'react'
import { PropsUtil } from '../../../utils/propsUtil'
import { MultiSelect } from '../MultiSelect/MultiSelect'

export interface MultiSelectPropertyProps extends PropertyField<string[]>, PropsWithChildren {}

export const MultiSelectProperty = ({
  children,
  value,
  onValueChange,
  onEditComplete,
  ...props
}: MultiSelectPropertyProps) => {
  const hasValue = value !== undefined && value.length > 0

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
          <MultiSelect.Root
            value={value}
            onValueChange={(val) => {
              const arr = val as string[]
              onValueChange?.(arr)
              onEditComplete?.(arr)
            }}
            disabled={props.readOnly}
          >
            <MultiSelect.ChipDisplayTrigger
              className="flex flex-wrap gap-x-2 gap-y-2 p-0 items-center hover:cursor-pointer border-0"
            />
            <MultiSelect.Content className="!border-none !min-h-10">
              {children}
            </MultiSelect.Content>
          </MultiSelect.Root>
        </div>
      )}
    </PropertyBase>
  )
}
