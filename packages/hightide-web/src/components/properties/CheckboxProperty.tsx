import { Check } from 'lucide-react'
import { useControlledState } from '@helpwave/hightide-utils/hooks'
import { Icon } from '../visualization/Icon'
import { PropertyBase, type PropertyField } from './PropertyBase'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { Button } from '../interaction/Button'
import type { CheckboxEvent } from '../data-input/boolean/Checkbox'

export type CheckboxPropertyProps = PropertyField<boolean, CheckboxEvent>

/**
 * An Input component for a boolean values
 */
export const CheckboxProperty = ({
  value,
  initialValue,
  onValueChange,
  onStateEvent,
  onEditComplete,
  isReadOnly,
  isDisabled,
  isInvalid,
  isRequired,
  id,
  ...baseProps
}: CheckboxPropertyProps) => {
  const translation = useHightideTranslation()
  const [checked, setChecked] = useControlledState<boolean | undefined>({
    value,
    onValueChange: (next) => {
      if (next !== undefined) onValueChange?.(next)
    },
    defaultValue: initialValue,
    isControlled: value !== undefined || initialValue === undefined,
  })
  const locked = !!isReadOnly || !!isDisabled

  const choose = (next: boolean) => {
    if (locked) return
    setChecked(next)
    onStateEvent?.({ type: 'toggle' })
    onEditComplete?.(next)
  }

  return (
    <PropertyBase
      {...baseProps}
      hasValue={checked !== undefined}
      isReadOnly={isReadOnly}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      isRequired={isRequired}
      icon={<Icon icon={Check} />}
    >
      {() => (
        <div id={id} className="flex-row-2 items-center">
          <Button
            color={checked ? 'positive' : 'neutral'} size="sm"
            disabled={locked}
            onClick={() => choose(true)}
            className="min-w-20"
          >
            {translation('yes')}
          </Button>
          <Button
            color={!checked && checked !== undefined ? 'negative' : 'neutral'} size="sm"
            disabled={locked}
            onClick={() => choose(false)}
            className="min-w-20"
          >
            {translation('no')}
          </Button>
        </div>
      )}
    </PropertyBase>
  )
}
