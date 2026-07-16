import { type HTMLAttributes, useCallback } from 'react'
import type { FormFieldInteractionStates } from '../form/FieldLayout'
import type { FormFieldDataHandling } from '../form/FormField'
import { useControlledState } from '@/src/hooks/useControlledState'
import { useEventCallbackStabilizer } from '@/src/hooks/useEventCallbackStabelizer'
import { PropsUtil } from '@/src/utils/propsUtil'

export type SwitchProps = HTMLAttributes<HTMLDivElement>
  & Partial<FormFieldInteractionStates>
  & Partial<FormFieldDataHandling<boolean>>
  & {
    initialValue?: boolean,
  }

/**
 * A binary on/off switch
 *
 * The state is managed by the parent.
 */
export const Switch = ({
  value: controlledValue,
  initialValue = false,
  required = false,
  invalid = false,
  disabled = false,
  readOnly = false,
  onValueChange,
  onEditComplete,
  ...props
}: SwitchProps) => {
  const onEditCompleteStable = useEventCallbackStabilizer(onEditComplete)
  const onValueChangeStable = useEventCallbackStabilizer(onValueChange)

  const onChangeWrapper = useCallback((value: boolean) => {
    onValueChangeStable(!value)
    onEditCompleteStable(!value)
  }, [onValueChangeStable, onEditCompleteStable])

  const [value, setValue] = useControlledState({
    value: controlledValue,
    onValueChange: onChangeWrapper,
    defaultValue: initialValue,
  })

  return (
    <div
      {...props}

      onClick={(event) => {
        if (!disabled && !readOnly) {
          setValue(prev => !prev)
          props.onClick?.(event)
        }
      }}
      onKeyDown={(event) => {
        if (disabled || readOnly) return
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault()
          setValue(prev => !prev)
          props.onKeyDown?.(event)
        }
      }}

      role="switch"
      tabIndex={disabled ? -1 : 0}
      aria-checked={value}
      {...PropsUtil.aria.interactionStates({ disabled, invalid, readOnly, required }, props)}

      data-name={props['data-name'] ?? 'switch'}
      data-active={PropsUtil.dataAttributes.bool(value)}
      {...PropsUtil.dataAttributes.interactionStates({ disabled, invalid, readOnly, required })}
    >
      <div data-name="switch-track" className="switch-track">
        <div data-name="switch-thumb" data-active={PropsUtil.dataAttributes.bool(value)} className="switch-thumb" />
      </div>
    </div>
  )
}


