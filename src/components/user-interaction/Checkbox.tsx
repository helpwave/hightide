import { Check, Minus } from 'lucide-react'
import { useOverwritableState } from '@/src/hooks/useOverwritableState'
import type { HTMLAttributes } from 'react'
import { DataAttributesUtil } from '@/src/utils/dataAttribute'
import { Visibility } from '../layout/Visibility'

type CheckBoxSize = 'sm' | 'md' | 'lg' | null

export type CheckboxProps = HTMLAttributes<HTMLDivElement> & {
  checked?: boolean,
  disabled?: boolean,
  indeterminate?: boolean,
  invalid?: boolean,
  onCheckedChange?: (checked: boolean) => void,
  size?: CheckBoxSize,
  alwaysShowCheckIcon?: boolean,
}

/**
 * A Tristate checkbox
 *
 * The state is managed by the parent
 */
export const Checkbox = ({
  disabled,
  checked = false,
  indeterminate = false,
  invalid = false,
  onCheckedChange,
  size = 'md',
  alwaysShowCheckIcon = false,
  ...props
}: CheckboxProps) => {
  return (
    <div
      {...props}
      onClick={(event) => {
        if (!disabled) {
          onCheckedChange(!checked)
          props.onClick?.(event)
        }
      }}
      onKeyDown={(event) => {
        if (disabled) return
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault()
          onCheckedChange(!checked)
          props.onKeyDown?.(event)
        }
      }}

      data-name={DataAttributesUtil.name('checkbox', props)}
      data-checked={!indeterminate ? checked : 'indeterminate'}
      data-disabled={DataAttributesUtil.bool(disabled)}
      data-invalid={DataAttributesUtil.bool(invalid)}
      data-size={size ?? undefined}

      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
    >
      <Visibility isVisible={indeterminate}>
        <Minus data-name="checkbox-indicator" aria-hidden={true}/>
      </Visibility>
      <Visibility isVisible={!indeterminate && (alwaysShowCheckIcon || checked)}>
        <Check data-name="checkbox-indicator" aria-hidden={true}/>
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
  checked: initialChecked,
  onCheckedChange,
  ...props
}: CheckboxUncontrolledProps) => {
  const [checked, setChecked] = useOverwritableState(initialChecked, onCheckedChange)

  return (
    <Checkbox
      {...props}
      checked={checked}
      onCheckedChange={setChecked}
    />
  )
}