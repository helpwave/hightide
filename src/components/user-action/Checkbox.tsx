import { Check, Minus } from 'lucide-react'
import clsx from 'clsx'
import { useOverwritableState } from '@/src/hooks/useOverwritableState'
import type { HTMLAttributes } from 'react'

type CheckBoxSize = 'small' | 'medium' | 'large'

const checkboxSizeMapping: Record<CheckBoxSize, string> = {
  small: 'size-5 border-2',
  medium: 'size-6 border-2',
  large: 'size-8 border-2',
}

const checkboxIconSizeMapping: Record<CheckBoxSize, string> = {
  small: 'size-3.5 stroke-3',
  medium: 'size-4.5 stroke-3',
  large: 'size-6 stroke-3',
}

export type CheckboxProps = HTMLAttributes<HTMLDivElement> & {
  checked?: boolean,
  disabled?: boolean,
  indeterminate?: boolean,
  invalid?: boolean,
  onCheckedChange?: (checked: boolean) => void,
  size?: CheckBoxSize,
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
                           size = 'medium',
                           className = '',
                           ...props
                         }: CheckboxProps) => {
  const usedSizeClass = checkboxSizeMapping[size]
  const innerIconSize = checkboxIconSizeMapping[size]

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
      className={clsx(
        usedSizeClass,
        className
      )}

      data-name={props['data-name'] ?? 'checkbox'}
      data-value={!indeterminate ? checked : 'indeterminate'}
      data-disabled={disabled ? '' : undefined}
      data-invalid={invalid ? '' : undefined}

      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
    >
      {!indeterminate && <Check className={innerIconSize} aria-hidden={true}/>}
      {indeterminate && <Minus className={innerIconSize} aria-hidden={true}/>}
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