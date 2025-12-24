import { Check } from 'lucide-react'
import type { PropertyBaseProps } from './PropertyBase'
import { PropertyBase } from './PropertyBase'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { Button } from '@/src/components/user-interaction/Button'


export type CheckboxPropertyProps = Omit<PropertyBaseProps, 'icon' | 'input' | 'hasValue' | 'onRemove'> & {
  value?: boolean,
  onChange?: (value: boolean) => void,
}

/**
 * An Input component for a boolean values
 */
export const CheckboxProperty = ({
  value,
  onChange,
  readOnly,
  ...baseProps
}: CheckboxPropertyProps) => {
  const translation = useHightideTranslation()

  return (
    <PropertyBase
      {...baseProps}
      hasValue={true}
      readOnly={readOnly}
      icon={<Check size={24}/>}
      input={() => (
        <div className="flex-row-2 items-center">
          <Button
            color={value ? 'positive' : 'neutral'} size="sm"
            onClick={() => onChange(true)}
            className="min-w-20"
          >
            {translation('yes')}
          </Button>
          <Button
            color={!value && value !== undefined ? 'negative' : 'neutral'} size="sm"
            onClick={() => onChange(false)}
            className="min-w-20"
          >
            {translation('no')}
          </Button>
        </div>
      )}
    />
  )
}
