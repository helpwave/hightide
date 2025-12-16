import { List } from 'lucide-react'
import clsx from 'clsx'
import type { PropsWithChildren } from 'react'
import type { PropertyBaseProps } from '@/src/components/properties/PropertyBase'
import { PropertyBase } from '@/src/components/properties/PropertyBase'

import { MultiSelectChipDisplay } from '@/src/components/user-action/Select'

export type MultiSelectPropertyProps =
  Omit<PropertyBaseProps, 'icon' | 'input' | 'hasValue' | 'className'>
  & PropsWithChildren<{
  values: string[],
  onValuesChanged?: (value: string[]) => void,
}>

/**
 * An Input for MultiSelect properties
 */
export const MultiSelectProperty = ({
                                      children,
                                      values,
                                      onValuesChanged,
                                      ...props
                                    }: MultiSelectPropertyProps) => {
  const hasValue = values.length > 0

  return (
    <PropertyBase
      {...props}
      hasValue={hasValue}
      icon={<List size={24}/>}
      input={({ softRequired }) => (
        <MultiSelectChipDisplay
          values={values}
          onValuesChanged={onValuesChanged}
          disabled={props.readOnly}
          contentPanelProps={{
            className: clsx(
              '!border-none !min-h-10'
            )
          }}
          chipDisplayProps={{
            className: clsx(
              'default-style-none flex flex-wrap gap-x-2 gap-y-2 items-center hover:cursor-pointer',
              { '!bg-warning text-surface-warning': softRequired && !hasValue }
            )
          }}
        >
          {children}
        </MultiSelectChipDisplay>
      )}
    />
  )
}
