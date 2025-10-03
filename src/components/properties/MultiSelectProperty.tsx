import { List } from 'lucide-react'
import clsx from 'clsx'
import type { PropsForTranslation } from '@/src'
import { MultiSelectChipDisplay } from '@/src'
import type { PropertyBaseProps } from '@/src'
import { PropertyBase } from '@/src'
import type { FormTranslationType } from '@/src'
import type { PropsWithChildren } from 'react'

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
