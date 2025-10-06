import { Binary } from 'lucide-react'
import clsx from 'clsx'
import { Input } from '../user-action/input/Input'
import type { PropsForTranslation, Translation } from '../../localization/useTranslation'
import { useTranslation } from '../../localization/useTranslation'
import type { PropertyBaseProps } from './PropertyBase'
import { PropertyBase } from './PropertyBase'

type NumberPropertyTranslation = {
  value: string,
}

const defaultNumberPropertyTranslation: Translation<NumberPropertyTranslation> = {
  en: {
    value: 'Value'
  },
  de: {
    value: 'Wert'
  }
}

export type NumberPropertyProps = Omit<PropertyBaseProps, 'icon' | 'input' | 'hasValue'> & {
  value?: number,
  suffix?: string,
  onChange?: (value: number) => void,
  onEditComplete?: (value: number) => void,
}

/**
 * An Input for number properties
 */
export const NumberProperty = ({
                                 overwriteTranslation,
                                 value,
                                 onChange,
                                 onRemove,
                                 onEditComplete,
                                 readOnly,
                                 suffix,
                                 ...baseProps
                               }: PropsForTranslation<NumberPropertyTranslation, NumberPropertyProps>) => {
  const translation = useTranslation([defaultNumberPropertyTranslation], overwriteTranslation)
  const hasValue = value !== undefined

  return (
    <PropertyBase
      {...baseProps}
      onRemove={onRemove}
      hasValue={hasValue}
      icon={<Binary size={24}/>}
      input={({ softRequired }) => (
        <div
          className={clsx('flex-row-2 grow', { 'text-warning': softRequired && !hasValue })}
        >
          <Input
            className={clsx('!ring-0 !border-0 !outline-0 !p-0 !m-0 !w-fit !shadow-none !rounded-none', { 'bg-surface-warning placeholder-warning': softRequired && !hasValue })}
            value={value?.toString() ?? ''}
            type="number"
            readOnly={readOnly}
            placeholder={`${translation('value')}...`}
            onChangeText={(value) => {
              const numberValue = parseFloat(value)
              if (isNaN(numberValue)) {
                onRemove()
              } else {
                onChange?.(numberValue)
              }
            }}
            onEditCompleted={(value) => {
              const numberValue = parseFloat(value)
              if (isNaN(numberValue)) {
                onRemove()
              } else {
                onEditComplete(numberValue)
              }
            }}
          />
          {suffix && <span className={clsx('ml-1', { 'bg-surface-warning': softRequired && !hasValue })}>{suffix}</span>}
        </div>
      )}
    />
  )
}
