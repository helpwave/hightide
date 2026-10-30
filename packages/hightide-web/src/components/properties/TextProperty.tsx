import { Text } from 'lucide-react'
import { Icon } from '../visualization/Icon'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { useEditCompletable } from '@helpwave/hightide-utils/hooks'
import { Textarea } from '../data-input/text/Textarea'
import type { TextareaEvent } from '../data-input/text/Textarea'
import type { PropertyField } from './PropertyBase'
import { PropertyBase } from './PropertyBase'

export type TextPropertyProps = PropertyField<string, TextareaEvent>

/**
 * An Input for Text properties
 */
export const TextProperty = ({
  value,
  initialValue,
  onValueChange,
  onStateEvent,
  onEditComplete,
  isReadOnly,
  isInvalid,
  isDisabled,
  isRequired,
  ...baseProps
}: TextPropertyProps) => {
  const translation = useHightideTranslation()
  const hasValue = value !== undefined
  const edit = useEditCompletable({
    value: value ?? initialValue ?? '',
    onEditComplete,
    delay: 3000,
  })

  return (
    <PropertyBase
      {...baseProps}
      isReadOnly={isReadOnly}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      isRequired={isRequired}
      hasValue={hasValue}
      icon={<Icon icon={Text} />}
    >
      {({ invalid }) => (
        <Textarea
          value={value}
          initialValue={initialValue}
          isReadOnly={isReadOnly}
          isInvalid={invalid}
          isDisabled={isDisabled}
          isRequired={isRequired}
          onValueChange={onValueChange}
          onStateEvent={onStateEvent}
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
