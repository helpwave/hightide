import { Check } from 'lucide-react'
import { Checkbox } from '../user-action/Checkbox'
import type { PropertyBaseProps } from './PropertyBase'
import { PropertyBase } from './PropertyBase'
import { useId } from 'react'
import { Label } from '@/src/components/user-action/Label'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'


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
  const id= useId()

  return (
    <PropertyBase
      {...baseProps}
      hasValue={true}
      readOnly={readOnly}
      icon={<Check size={24}/>}
      input={() => (
        <div className="flex-row-2 items-center">
          <Checkbox
            id={id}
            checked={value ?? true}
            disabled={readOnly}
            onChange={onChange}
            aria-labelledby={id+'label'}
          />
          <Label id={id+'label'}>
            {`${translation('yes')}/${translation('no')}`}
          </Label>
        </div>
      )}
    />
  )
}
