import { List } from 'lucide-react'
import clsx from 'clsx'
import type { PropsForTranslation } from '../../localization/useTranslation'
import { useTranslation } from '../../localization/useTranslation'
import type { PropertyBaseProps } from './PropertyBase'
import { PropertyBase } from './PropertyBase'
import type { SelectProps } from '../user-action/Select'
import { Select } from '../user-action/Select'
import type { FormTranslationType } from '../../localization/defaults/form'
import { formTranslation } from '../../localization/defaults/form'

type SingleSelectPropertyTranslation = FormTranslationType

export type SingleSelectPropertyProps<T> =
  Omit<PropertyBaseProps & SelectProps<T>, 'icon' | 'input' | 'hasValue' | 'className' | 'disabled' | 'label' | 'labelClassName' | 'additionalItems'>

/**
 * An Input for SingleSelect properties
 */
export const SingleSelectProperty = <T, >({
                                            overwriteTranslation,
                                            value,
                                            options,
                                            name,
                                            readOnly = false,
                                            softRequired,
                                            onRemove,
                                            ...selectProps
                                          }: PropsForTranslation<SingleSelectPropertyTranslation, SingleSelectPropertyProps<T>>) => {
  const translation = useTranslation([formTranslation], overwriteTranslation)
  const hasValue = value !== undefined

  return (
    <PropertyBase
      name={name}
      onRemove={onRemove}
      readOnly={readOnly}
      softRequired={softRequired}
      hasValue={hasValue}
      icon={<List size={16}/>}
      input={({ softRequired }) => (
        <div
          className={clsx('row grow py-2 px-4 cursor-pointer', { 'text-warning': softRequired && !hasValue })}
        >
          <Select
            {...selectProps}
            value={value}
            options={options}
            isDisabled={readOnly}
            className={clsx('w-full', { 'bg-surface-warning': softRequired && !hasValue })}
            hintText={`${translation('select')}...`}
          />
        </div>
      )}
    />
  )
}
