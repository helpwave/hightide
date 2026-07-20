import { Check, Minus } from 'lucide-react'
import { useCallback, type HTMLAttributes } from 'react'
import { Visibility } from '../layout/Visibility'
import { PropsUtil } from '@/src/utils/propsUtil'
import type { FormFieldInteractionStates } from '../form/FieldLayout'
import type { FormFieldDataHandling } from '../form/FormField'
import { useControlledState } from '@helpwave/hightide-utils/hooks'
import { useEventCallbackStabilizer } from '@helpwave/hightide-utils/hooks'

type CheckBoxSize = 'sm' | 'md' | 'lg' | null

export type CheckboxProps = HTMLAttributes<HTMLDivElement>
  & Partial<FormFieldInteractionStates>
  & Partial<FormFieldDataHandling<boolean>>
  & {
    initialValue?: boolean,
    indeterminate?: boolean,
    size?: CheckBoxSize,
    alwaysShowCheckIcon?: boolean,
    isRounded?: boolean,
    interactive?: boolean,
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
  isRounded = false,
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

  const interactive = !disabled && !readOnly

  return (
    <div
      {...props}

      onClick={(event) => {
        if (interactive) {
          setValue(prev => !prev)
        }
        props.onClick?.(event)
      }}
      onKeyDown={(event) => {
        if (!interactive) return
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault()
          setValue(prev => !prev)
        }
        props.onKeyDown?.(event)
      }}

      data-checked={!indeterminate ? value : 'indeterminate'}
      data-size={size ?? undefined}
      data-rounded={isRounded ? '' : undefined}
      {...PropsUtil.dataAttributes.interactionStates({ disabled, invalid, readOnly, required })}

      role={interactive ? 'checkbox' : undefined}
      tabIndex={interactive ? (disabled ? -1 : 0) : undefined}
      aria-hidden={interactive ? undefined : true}

      aria-checked={interactive ? (indeterminate ? 'mixed' : value) : undefined}
      {...PropsUtil.aria.interactionStates({ disabled, invalid, readOnly, required }, props)}

      data-name="checkbox"
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