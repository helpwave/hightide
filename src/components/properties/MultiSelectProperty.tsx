import { List } from 'lucide-react'
import clsx from 'clsx'
import type { Language } from '../../localization/util'
import type { PropsForTranslation } from '../../localization/useTranslation'
import { useTranslation } from '../../localization/useTranslation'
import type { MultiSelectProps } from '../user-action/MultiSelect'
import { MultiSelect } from '../user-action/MultiSelect'
import type { PropertyBaseProps } from './PropertyBase'
import { PropertyBase } from './PropertyBase'

type MultiSelectPropertyTranslation = {
  select: string,
}

const defaultMultiSelectPropertyTranslation: Record<Language, MultiSelectPropertyTranslation> = {
  en: {
    select: 'Select'
  },
  de: {
    select: 'Auswählen'
  }
}

export type MultiSelectPropertyProps<T> =
  Omit<PropertyBaseProps & MultiSelectProps<T>, 'icon' | 'input' | 'hasValue' | 'className' | 'disabled' | 'label' | 'triggerClassName'>

/**
 * An Input for MultiSelect properties
 */
export const MultiSelectProperty = <T, >({
                                           overwriteTranslation,
                                           options,
                                           name,
                                           readOnly = false,
                                           softRequired,
                                           onRemove,
                                           ...multiSelectProps
                                         }: PropsForTranslation<MultiSelectPropertyTranslation, MultiSelectPropertyProps<T>>) => {
  const translation = useTranslation(defaultMultiSelectPropertyTranslation, overwriteTranslation)
  const hasValue = options.some(value => value.selected)

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
          <MultiSelect
            {...multiSelectProps}
            className={clsx('w-full', { 'bg-surface-warning': softRequired && !hasValue })}
            options={options}
            isDisabled={readOnly}
            useChipDisplay={true}
            hintText={`${translation.select}...`}
          />
        </div>
      )}
    />
  )
}
