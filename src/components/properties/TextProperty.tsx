import { Text } from 'lucide-react'
import clsx from 'clsx'
import type { PropsForTranslation, Translation } from '../../localization/useTranslation'
import { useTranslation } from '../../localization/useTranslation'
import { Textarea } from '../user-action/Textarea'
import { noop } from '@/src/utils/noop'
import type { PropertyBaseProps } from './PropertyBase'
import { PropertyBase } from './PropertyBase'

type TextPropertyTranslation = {
  text: string,
}

const defaultTextPropertyTranslation: Translation<TextPropertyTranslation> = {
  en: {
    text: 'Text'
  },
  de: {
    text: 'Text'
  }
}

export type TextPropertyProps = Omit<PropertyBaseProps, 'icon' | 'input' | 'hasValue'> & {
  value?: string,
  onChange?: (value: string) => void,
  onEditComplete?: (value: string) => void,
}

/**
 * An Input for Text properties
 */
export const TextProperty = ({
                               overwriteTranslation,
                               value,
                               readOnly,
                               onChange = noop,
                               onRemove = noop,
                               onEditComplete = noop,
                               ...baseProps
                             }: PropsForTranslation<TextPropertyTranslation, TextPropertyProps>) => {
  const translation = useTranslation([defaultTextPropertyTranslation], overwriteTranslation)
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
              onRemove()
            } else {
              onChange(value)
            }
          }}
          onEditCompleted={(value) => {
            if (!value) {
              onRemove()
            } else {
              onEditComplete(value)
            }
          }}
        />
      )}
    />
  )
}
