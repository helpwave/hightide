import { Text } from 'lucide-react'
import clsx from 'clsx'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { Textarea } from '@/src/components/user-interaction/Textarea'
import { PropertyField } from './PropertyField'

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
    <PropertyField
      {...baseProps}
      onRemove={onRemove}
      hasValue={hasValue}
      icon={<Text size={24}/>}
    >
      {({ softRequired }) => (
        <Textarea
          className={clsx(
            'default-style-none focus-style-none w-full',
            { 'bg-surface-warning placeholder-warning': softRequired && !hasValue }
          )}
          rows={5}
          value={value ?? ''}
          readOnly={readOnly}
          placeholder={`${translation('text')}...`}
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
    </PropertyField>
  )
}
