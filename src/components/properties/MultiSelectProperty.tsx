import { List } from 'lucide-react'
import clsx from 'clsx'
import type { PropsForTranslation } from '../../localization/useTranslation'
import { MultiSelectChipDisplay, SelectOption } from '../user-action/select/Select'
import type { PropertyBaseProps } from './PropertyBase'
import { PropertyBase } from './PropertyBase'
import type { FormTranslationType } from '../../localization/defaults/form'

type TranslationType = FormTranslationType

type SelectPropertyOption = {
  value: string,
  label?: string,
}

export type MultiSelectPropertyProps = Omit<PropertyBaseProps, 'icon' | 'input' | 'hasValue' | 'className'> & {
  values: string[],
  options: SelectPropertyOption[],
  onValuesChanged?: (value: string[]) => void,
}

/**
 * An Input for MultiSelect properties
 */
export const MultiSelectProperty = ({
                                      values,
                                      options,
                                      onValuesChanged,
                                      ...props
                                    }: PropsForTranslation<TranslationType, MultiSelectPropertyProps>) => {
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
            className: clsx({
              '!bg-warning !text-surface-warning': softRequired && !hasValue,
            })
          }}
        >
          {options.map(option => (
            <SelectOption key={option.value} value={option.value}>
              {option.label ?? option.value}
            </SelectOption>
          ))}
        </MultiSelectChipDisplay>
      )}
    />
  )
}
