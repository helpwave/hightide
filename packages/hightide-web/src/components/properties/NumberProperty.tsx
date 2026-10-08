import { Binary } from 'lucide-react'
import { Icon } from '../visualization/Icon'
import { TextInput } from '../data-input/input/TextInput'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { useEditCompletable } from '@helpwave/hightide-utils/hooks'
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
  const edit = useEditCompletable({
    value: value?.toString() ?? '',
    isTimerEnabled: false,
    onEditComplete: (next) => {
      const numberValue = parseFloat(next)
      if (isNaN(numberValue)) {
        onValueClear?.()
      } else {
        onEditComplete?.(numberValue)
      }
    },
  })

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
            value={value?.toString() ?? ''}
            isReadOnly={readOnly}
            isInvalid={invalid}
            onValueChange={(next) => {
              const numberValue = parseFloat(next)
              if (isNaN(numberValue)) {
                onValueClear?.()
              } else {
                onValueChange?.(numberValue)
              }
            }}
            inputProps={{
              className: 'property-input w-full pr-8',
              type: 'number',
              placeholder: translation('value'),
              onBlur: () => {
                edit.completeNow()
              },
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
