import { Text } from 'lucide-react'
import { Icon } from '../visualization/Icon'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { Textarea } from '../data-input/Textarea'
import type { PropertyField } from './PropertyBase'
import { PropertyBase } from './PropertyBase'
import { PropsUtil } from '../../utils/propsUtil'

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

  return (
    <PropertyBase
      {...baseProps}
      hasValue={hasValue}
      icon={<Icon icon={Text} />}
    >
      {({ invalid }) => (
        <Textarea
          className="property-input w-full"
          data-invalid={PropsUtil.dataAttributes.bool(invalid)}
          rows={5}
          value={value ?? ''}
          readOnly={readOnly}
          placeholder={translation('text')}
          onValueUpdate={(value) => onValueChange?.(value)}
          onValueCommit={(value) => onEditComplete?.(value)}
        />
      )}
    </PropertyBase>
  )
}
