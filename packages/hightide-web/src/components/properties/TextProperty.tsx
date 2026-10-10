import { Text } from 'lucide-react'
import { Icon } from '../visualization/Icon'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { useEditCompletable } from '@helpwave/hightide-utils/hooks'
import { Textarea } from '../data-input/Textarea'
import type { PropertyField } from './PropertyBase'
import { PropertyBase } from './PropertyBase'

export type TextPropertyProps = PropertyField<string>

/**
 * An Input for Text properties
 */
export const TextProperty = ({
  value,
  readOnly,
  onValueChange,
  onEditComplete,
  ...baseProps
}: TextPropertyProps) => {
  const translation = useHightideTranslation()
  const hasValue = value !== undefined
  const edit = useEditCompletable({
    value: value ?? '',
    onEditComplete,
    delay: 3000,
  })

  return (
    <PropertyBase
      {...baseProps}
      hasValue={hasValue}
      icon={<Icon icon={Text} />}
    >
      {({ invalid }) => (
        <Textarea
          value={value ?? ''}
          isReadOnly={readOnly}
          isInvalid={invalid}
          onValueChange={(next) => onValueChange?.(next)}
          inputProps={{
            className: 'property-input w-full',
            rows: 5,
            placeholder: translation('text'),
            onChange: () => edit.setTimer(),
            onBlur: () => edit.completeNow(),
          }}
        />
      )}
    </PropertyBase>
  )
}
