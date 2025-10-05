import { List } from 'lucide-react'
import clsx from 'clsx'
import type { PropsWithChildren } from 'react'
import type { FormTranslationType } from '@/src/localization/defaults/form'
import type { PropertyBaseProps } from '@/src/components/properties/PropertyBase'
import { PropertyBase } from '@/src/components/properties/PropertyBase'
import type { PropsForTranslation } from '@/src/localization/useTranslation'
import { MultiSelectChipDisplay } from '@/src/components/user-action/select/Select'

type TranslationType = FormTranslationType

export type MultiSelectPropertyProps = Omit<PropertyBaseProps, 'icon' | 'input' | 'hasValue' | 'className'> & PropsWithChildren<{
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
          {children}
        </MultiSelectChipDisplay>
      )}
    />
  )
}
