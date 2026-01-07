import { Check } from 'lucide-react'
import { PropertyBase, PropertyField} from './PropertyBase'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { Button } from '@/src/components/user-interaction/Button'


export type CheckboxPropertyProps = PropertyField<boolean>

/**
 * An Input component for a boolean values
 */
export const CheckboxProperty = ({
  value,
  onValueChange,
  onEditComplete,
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
    >
      {() => (
        <div className="flex-row-2 items-center">
          <Button
            color={value ? 'positive' : 'neutral'} size="sm"
            onClick={() => {
              onValueChange(true)
              onEditComplete(true)
            }}
            className="min-w-20"
          >
            {translation('yes')}
          </Button>
          <Button
            color={!value && value !== undefined ? 'negative' : 'neutral'} size="sm"
            onClick={() => {
              onValueChange(false)
              onEditComplete(false)
            }}
            className="min-w-20"
          >
            {translation('no')}
          </Button>
        </div>
      )}
    </PropertyBase>
  )
}
