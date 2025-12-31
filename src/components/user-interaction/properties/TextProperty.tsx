import { Text } from 'lucide-react'
import clsx from 'clsx'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { Textarea } from '@/src/components/user-interaction/Textarea'
import type { PropertyBaseProps } from './PropertyBase'
import { PropertyBase } from './PropertyBase'

export type TextPropertyProps = Omit<PropertyBaseProps, 'icon' | 'input' | 'hasValue'> & {
  value?: string,
  onChange?: (value: string) => void,
  onEditComplete?: (value: string) => void,
}

/**
 * An Input for Text properties
 */
export const TextProperty = ({
  value,
  readOnly,
  onChange,
  onRemove,
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
      input={({ softRequired }) => (
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
              onChange?.(value)
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
    />
  )
}
