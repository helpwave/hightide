import { Binary } from 'lucide-react'
import { Input } from '@/src/components/user-interaction/input/Input'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import type { PropertyField } from './PropertyBase'
import { PropertyBase } from './PropertyBase'
import { PropsUtil } from '@/src/utils/propsUtil'

export type NumberPropertyProps = PropertyField<number>
& { suffix?: string }

/**
 * An Input for number properties
 */
export const NumberProperty = ({
  value,
  onValueChange,
  onEditComplete,
  onValueClear,
  readOnly,
  suffix,
  ...baseProps
}: NumberPropertyProps) => {
  const translation = useHightideTranslation()
  const hasValue = value !== undefined

  return (
    <PropertyBase
      {...baseProps}
      onValueClear={onValueClear}
      hasValue={hasValue}
      icon={<Binary size={24}/>}
    >
      {({ invalid }) => (
        <div
          data-name="property-input-wrapper"
          data-invalid={PropsUtil.dataAttributes.bool(invalid)}
        >
          <Input
            className="w-full pr-8"
            data-name="property-input"
            data-invalid={PropsUtil.dataAttributes.bool(invalid)}
            value={value?.toString() ?? ''}
            type="number"
            readOnly={readOnly}
            placeholder={translation('value')}
            onValueChange={(value) => {
              const numberValue = parseFloat(value)
              if (isNaN(numberValue)) {
                onValueClear()
              } else {
                onValueChange?.(numberValue)
              }
            }}
            onEditComplete={(value) => {
              const numberValue = parseFloat(value)
              if (isNaN(numberValue)) {
                onValueClear()
              } else {
                onEditComplete?.(numberValue)
              }
            }}
          />
          {suffix && (
            <span
              data-name="property-suffix"
              data-invalid={PropsUtil.dataAttributes.bool(invalid)}
            >
              {suffix}
            </span>
          )}
        </div>
      )}
    </PropertyBase>
  )
}
