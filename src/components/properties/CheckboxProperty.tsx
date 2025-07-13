import { Check } from 'lucide-react'
import { noop } from '../../util/noop'
import { Checkbox } from '../user-action/Checkbox'
import type { PropsForTranslation } from '../../localization/useTranslation'
import { useTranslation } from '../../localization/useTranslation'
import type { PropertyBaseProps } from './PropertyBase'
import { PropertyBase } from './PropertyBase'
import type { FormTranslationType } from '../../localization/defaults/form'
import { formTranslation } from '../../localization/defaults/form'

type CheckboxPropertyTranslation = FormTranslationType

export type CheckboxPropertyProps = Omit<PropertyBaseProps, 'icon' | 'input' | 'hasValue' | 'onRemove'> & {
  value?: boolean,
  onChange?: (value: boolean) => void,
}

/**
 * An Input component for a boolean values
 */
export const CheckboxProperty = ({
                                   overwriteTranslation,
                                   value,
                                   onChange = noop,
                                   readOnly,
                                   ...baseProps
                                 }: PropsForTranslation<CheckboxPropertyTranslation, CheckboxPropertyProps>) => {
  const translation = useTranslation([formTranslation], overwriteTranslation)

  return (
    <PropertyBase
      {...baseProps}
      hasValue={true}
      readOnly={readOnly}
      icon={<Check size={16}/>}
      input={() => (
        <div className="flex-row-2 py-2 px-4 items-center">
          <Checkbox
            checked={value ?? true}
            disabled={readOnly}
            onChange={onChange}
            label={{ name: `${translation('yes')}/${translation('no')}`, labelType: 'labelMedium' }}
          />
        </div>
      )}
    />
  )
}
