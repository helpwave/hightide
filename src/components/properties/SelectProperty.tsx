import { List } from 'lucide-react'
import clsx from 'clsx'
import type { PropsForTranslation } from '@/src'
import type { PropertyBaseProps } from '@/src'
import { PropertyBase } from '@/src'
import { Select } from '@/src'
import type { FormTranslationType } from '@/src'
import type { PropsWithChildren, ReactNode } from 'react'

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
