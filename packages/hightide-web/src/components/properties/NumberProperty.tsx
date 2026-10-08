import { Binary } from 'lucide-react'
import { Icon } from '../visualization/Icon'
import { TextInput } from '../data-input/input/TextInput'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import type { PropertyField } from './PropertyBase'
import { PropertyBase } from './PropertyBase'
import { PropsUtil } from '../../utils/propsUtil'

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
      icon={<Icon icon={Binary} />}
    >
      {({ invalid }) => (
        <div
          className="property-input-wrapper"
          data-invalid={PropsUtil.dataAttributes.bool(invalid)}
        >
          <TextInput
            className="property-input w-full pr-8"
            data-invalid={PropsUtil.dataAttributes.bool(invalid)}
            value={value?.toString() ?? ''}
            type="number"
            readOnly={readOnly}
            placeholder={translation('value')}
            onValueUpdate={(value) => {
              const numberValue = parseFloat(value)
              if (isNaN(numberValue)) {
                onValueClear?.()
              } else {
                onValueChange?.(numberValue)
              }
            }}
            onValueCommit={(value) => {
              const numberValue = parseFloat(value)
              if (isNaN(numberValue)) {
                onValueClear?.()
              } else {
                onEditComplete?.(numberValue)
              }
            }}
          />
          {suffix && (
            <span
              className="property-suffix"
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
