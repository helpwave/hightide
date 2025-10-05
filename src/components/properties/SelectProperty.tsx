import { List } from 'lucide-react'
import clsx from 'clsx'
import type { PropsWithChildren, ReactNode } from 'react'
import type { FormTranslationType } from '@/src/localization/defaults/form'
import type { PropertyBaseProps } from '@/src/components/properties/PropertyBase'
import { PropertyBase } from '@/src/components/properties/PropertyBase'
import type { PropsForTranslation } from '@/src/localization/useTranslation'
import { Select } from '@/src/components/user-action/select/Select'

type SingleSelectPropertyTranslation = FormTranslationType

export type SingleSelectPropertyProps =
  Omit<PropertyBaseProps, 'icon' | 'input' | 'hasValue' | 'className'>
  & PropsWithChildren<{
  value?: string,
  onValueChanged?: (value: string) => void,
  onAddNew?: (value: string) => void,
  selectedDisplay?: (value: string) => ReactNode,
}>

/**
 * An Input for SingleSelect properties
 */
export const SingleSelectProperty = ({
                                       children,
                                       value,
                                       onValueChanged,
                                       selectedDisplay,
                                       ...props
                                     }: PropsForTranslation<SingleSelectPropertyTranslation, SingleSelectPropertyProps>) => {
  const hasValue = value !== undefined

  return (
    <PropertyBase
      {...props}
      hasValue={hasValue}
      icon={<List size={24}/>}
      input={({ softRequired }) => (
        <Select
          value={value}
          onValueChanged={onValueChanged}
          disabled={props.readOnly}
          buttonProps={{
            className: clsx(
              'border-none w-full',
              {
                '!bg-warning !text-surface-warning': softRequired && !hasValue,
              }
            ),
            selectedDisplay: selectedDisplay,
          }}
        >
          {children}
        </Select>
      )}
    />
  )
}
