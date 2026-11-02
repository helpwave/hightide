import { useEffect, useRef, useState } from 'react'
import { Binary } from 'lucide-react'
import { Icon } from '../visualization/Icon'
import { TextInput } from '../data-input/text/TextInput'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { useEditCompletable } from '@helpwave/hightide-utils/hooks'
import type { NumberInputEvent } from '../data-input/number/NumberInput'
import type { PropertyField } from './PropertyBase'
import { PropertyBase } from './PropertyBase'
import { PropsUtil } from '../../utils/propsUtil'

export type NumberPropertyProps = PropertyField<number, NumberInputEvent>
& { suffix?: string }

const numberText = (next: number | undefined) => (
  next === undefined || Number.isNaN(next) ? '' : String(next)
)

/**
 * An Input for number properties
 */
export const NumberProperty = ({
  value,
  initialValue,
  onValueChange,
  onStateEvent,
  onEditComplete,
  onValueClear,
  isReadOnly,
  isInvalid,
  isDisabled,
  isRequired,
  id,
  suffix,
  ...baseProps
}: NumberPropertyProps) => {
  const translation = useHightideTranslation()
  const [text, setText] = useState(() => numberText(value ?? initialValue))
  const valueRef = useRef(value)
  const hasValue = value !== undefined || text.trim() !== ''
  const edit = useEditCompletable({
    value: text,
    isTimerEnabled: false,
    onEditComplete: (next) => {
      const numberValue = parseFloat(next)
      if (Number.isNaN(numberValue)) {
        onValueClear?.()
        return
      }
      onEditComplete?.(numberValue)
      onStateEvent?.({ type: 'commit', value: numberValue })
    },
  })

  useEffect(() => {
    if (value === valueRef.current) return
    valueRef.current = value
    setText(numberText(value))
  }, [value])

  return (
    <PropertyBase
      {...baseProps}
      onValueClear={onValueClear}
      isReadOnly={isReadOnly}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      isRequired={isRequired}
      hasValue={hasValue}
      icon={<Icon icon={Binary} />}
    >
      {({ invalid }) => (
        <div
          className="property-input-wrapper"
          data-invalid={PropsUtil.dataAttributes.bool(invalid)}
        >
          <TextInput
            value={text}
            isReadOnly={isReadOnly}
            isInvalid={invalid}
            isDisabled={isDisabled}
            isRequired={isRequired}
            id={id}
            onValueChange={(next) => {
              setText(next)
              const numberValue = parseFloat(next)
              if (Number.isNaN(numberValue)) {
                onValueClear?.()
                return
              }
              onValueChange?.(numberValue)
              onStateEvent?.({ type: 'change', value: numberValue })
            }}
            inputProps={{
              className: 'property-input w-full pr-8',
              type: 'number',
              placeholder: translation('value'),
              onBlur: () => {
                edit.completeNow()
              },
            }}
          />
          {suffix && (
            <span
              className="property-suffix"
              data-invalid={PropsUtil.dataAttributes.bool(invalid)}
            >
              {suffix}
            </span>
          )}
        </div>
      )}
    </PropertyBase>
  )
}
