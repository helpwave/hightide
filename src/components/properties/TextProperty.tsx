import { Text } from 'lucide-react'
import clsx from 'clsx'
import { useStandardTranslation } from '@/src/i18n/useTranslation'
import { Textarea } from '../user-action/Textarea'
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
  const translation = useStandardTranslation()
  const hasValue = value !== undefined

  return (
    <PropertyBase
      {...baseProps}
      onRemove={onRemove}
      hasValue={hasValue}
      icon={<Text size={24}/>}
      input={({ softRequired }) => (
        <Textarea
          className={clsx({
            'bg-surface-warning placeholder-warning': softRequired && !hasValue
          })}
          rows={5}
          defaultStyle={false}
          value={value ?? ''}
          readOnly={readOnly}
          placeholder={`${translation('text')}...`}
          onChangeText={(value) => {
            if (!value) {
              onRemove?.()
            } else {
              onChange?.(value)
            }
          }}
          onEditCompleted={(value) => {
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
