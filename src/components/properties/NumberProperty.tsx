import { Binary } from 'lucide-react'
import clsx from 'clsx'
import { Input } from '../user-action/input/Input'
import { useStandardTranslation } from '@/src/i18n/useTranslation'
import type { PropertyBaseProps } from './PropertyBase'
import { PropertyBase } from './PropertyBase'

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
                                 value,
                                 onChange,
                                 onRemove,
                                 onEditComplete,
                                 readOnly,
                                 suffix,
                                 ...baseProps
                               }: NumberPropertyProps) => {
  const translation = useStandardTranslation()
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
