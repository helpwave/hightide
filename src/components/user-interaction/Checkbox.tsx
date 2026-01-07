import { Check, Minus } from 'lucide-react'
import { useOverwritableState } from '@/src/hooks/useOverwritableState'
import { useCallback, type HTMLAttributes } from 'react'
import { Visibility } from '../layout/Visibility'
import { PropsUtil } from '@/src/utils/propsUtil'
import type { FormFieldInteractionStates } from '../form/FieldLayout'
import type { FormFieldDataHandling } from '../form/FormField'

type CheckBoxSize = 'sm' | 'md' | 'lg' | null

export type CheckboxProps = HTMLAttributes<HTMLDivElement>
  & Partial<FormFieldInteractionStates>
  & Partial<FormFieldDataHandling<boolean>>
  & {
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
  value = false,
  indeterminate = false,
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
  const onChangeWrapper = useCallback(() => {
    onValueChange?.(!value)
    onEditComplete?.(!value)
  }, [onEditComplete, onValueChange, value])

  return (
    <div
      {...props}

      onClick={(event) => {
        if (!disabled) {
          onChangeWrapper()
          props.onClick?.(event)
        }
      }}
      onKeyDown={(event) => {
        if (disabled) return
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault()
          onChangeWrapper()
          props.onKeyDown?.(event)
        }
      }}

      data-name={PropsUtil.dataAttributes.name('checkbox', props)}
      data-checked={!indeterminate ? value : 'indeterminate'}
      data-size={size ?? undefined}
      {...PropsUtil.dataAttributes.interactionStates({ disabled, invalid, readOnly, required })}

      role="checkbox"
      tabIndex={disabled ? -1 : 0}

      aria-checked={indeterminate ? 'mixed' : value}
      {...PropsUtil.aria.interactionStates({ disabled, invalid, readOnly, required }, props)}
    >
      <Visibility isVisible={indeterminate}>
        <Minus data-name="checkbox-indicator" aria-hidden={true} />
      </Visibility>
      <Visibility isVisible={!indeterminate && (alwaysShowCheckIcon || value)}>
        <Check data-name="checkbox-indicator" aria-hidden={true} />
      </Visibility>
    </div>
  )
}

export type CheckboxUncontrolledProps = CheckboxProps

/**
 * A Tristate checkbox
 *
 * The state is managed by this component
 */
export const CheckboxUncontrolled = ({
  value: initialValue,
  onValueChange,
  ...props
}: CheckboxUncontrolledProps) => {
  const [value, setValue] = useOverwritableState(initialValue, onValueChange)

  return (
    <Checkbox
      {...props}
      value={value}
      onValueChange={setValue}
    />
  )
}