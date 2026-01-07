import { Text } from 'lucide-react'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { Textarea } from '@/src/components/user-interaction/Textarea'
import type { PropertyField } from './PropertyBase'
import { PropertyBase } from './PropertyBase'
import { PropsUtil } from '@/src/utils/propsUtil'

export type TextPropertyProps = PropertyField<string>

/**
 * An Input for Text properties
 */
export const TextProperty = ({
  value,
  readOnly,
  onRemove,
  onValueChange,
  onEditComplete,
  ...baseProps
}: TextPropertyProps) => {
  const translation = useHightideTranslation()
  const hasValue = value !== undefined

  return (
    <PropertyBase
      {...baseProps}
      onRemove={onRemove}
      hasValue={hasValue}
      icon={<Text size={24}/>}
    >
      {({ invalid }) => (
        <Textarea
          className="w-full"
          data-name="property-input"
          data-invalid={PropsUtil.dataAttributes.bool(invalid)}
          rows={5}
          value={value ?? ''}
          readOnly={readOnly}
          placeholder={translation('text')}
          onValueChange={(value) => {
            if (!value) {
              onRemove?.()
            } else {
              onValueChange?.(value)
            }
          }}
          onEditComplete={(value) => {
            if (!value) {
              onRemove?.()
            } else {
              onEditComplete?.(value)
            }
          }}
        />
      )}
    </PropertyBase>
  )
}
