import { Check, Minus } from 'lucide-react'
import { useCallback, type HTMLAttributes } from 'react'
import { Visibility } from '../layout/Visibility'
import { PropsUtil } from '@/src/utils/propsUtil'
import type { FormFieldInteractionStates } from '../form/FieldLayout'
import type { FormFieldDataHandling } from '../form/FormField'
import { useControlledState } from '@/src/hooks/useControlledState'
import { useEventCallbackStabilizer } from '@/src/hooks/useEventCallbackStabelizer'

type CheckBoxSize = 'sm' | 'md' | 'lg' | null

export type CheckboxProps = HTMLAttributes<HTMLDivElement>
  & Partial<FormFieldInteractionStates>
  & Partial<FormFieldDataHandling<boolean>>
  & {
    initialValue?: boolean,
    indeterminate?: boolean,
    size?: CheckBoxSize,
    alwaysShowCheckIcon?: boolean,
  }

/**
 * A Tristate checkbox
 *
 * The state is managed by the parent
 */
export const Checkbox = ({
  value: controlledValue,
  initialValue = false,
  indeterminate,
  required = false,
  invalid = false,
  disabled = false,
  readOnly = false,
  onValueChange,
  onEditComplete,
  size = 'md',
  alwaysShowCheckIcon = false,
  ...props
}: CheckboxProps) => {
  const onEditCompleteStable = useEventCallbackStabilizer(onEditComplete)
  const onValueChangeStable = useEventCallbackStabilizer(onValueChange)
  const onChangeWrapper = useCallback((value: boolean) => {
    onValueChangeStable(value)
    onEditCompleteStable(value)
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
        if (!disabled) {
          setValue(prev => !prev)
          props.onClick?.(event)
        }
      }}
      onKeyDown={(event) => {
        if (disabled) return
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault()
          setValue(prev => !prev)
          props.onKeyDown?.(event)
        }
      }}

      data-checked={!indeterminate ? value : 'indeterminate'}
      data-size={size ?? undefined}
      {...PropsUtil.dataAttributes.interactionStates({ disabled, invalid, readOnly, required })}

      role="checkbox"
      tabIndex={disabled ? -1 : 0}

      aria-checked={indeterminate ? 'mixed' : value}
      {...PropsUtil.aria.interactionStates({ disabled, invalid, readOnly, required }, props)}

      data-name={props['data-name'] ?? 'checkbox'}
    >
      <Visibility isVisible={indeterminate}>
        <Minus data-name="checkbox-indicator" className="checkbox-indicator" aria-hidden={true} />
      </Visibility>
      <Visibility isVisible={!indeterminate && (alwaysShowCheckIcon || value)}>
        <Check data-name="checkbox-indicator" className="checkbox-indicator" aria-hidden={true} />
      </Visibility>
    </div>
  )
}