import { List } from 'lucide-react'
import clsx from 'clsx'
import type { PropsForTranslation } from '../../localization/useTranslation'
import type { PropertyBaseProps } from './PropertyBase'
import { PropertyBase } from './PropertyBase'
import { Select, SelectOption } from '../user-action/select/Select'
import type { FormTranslationType } from '../../localization/defaults/form'

type SingleSelectPropertyTranslation = FormTranslationType

export type SingleSelectPropertyProps = Omit<PropertyBaseProps, 'icon' | 'input' | 'hasValue' | 'className'> & {
  value: string,
  options: string[],
  onValueChanged?: (value: string) => void,
  onAddNew?: (value: string) => void,
}

/**
 * An Input for SingleSelect properties
 */
export const SingleSelectProperty = ({
                                       value,
                                       options,
                                       onValueChanged,
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
            )
          }}
        >
          {options.map(value => (<SelectOption key={value} value={value}/>))}
        </Select>
      )}
    />
  )
}
