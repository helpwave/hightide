import { Check, Minus } from 'lucide-react'
import clsx from 'clsx'
import { useOverwritableState } from '@/src/hooks/useOverwritableState'
import type { HTMLAttributes } from 'react'

type CheckBoxSize = 'sm' | 'md' | 'lg'

const checkboxSizeMapping: Record<CheckBoxSize, string> = {
  sm: 'size-5 border-1',
  md: 'size-6 border-1',
  lg: 'size-8 border-2',
}

const checkboxIconSizeMapping: Record<CheckBoxSize, string> = {
  sm: 'size-4 stroke-3',
  md: 'size-5 stroke-3',
  lg: 'size-7 stroke-3',
}

export type CheckboxProps = HTMLAttributes<HTMLDivElement> & {
  checked?: boolean,
  disabled?: boolean,
  indeterminate?: boolean,
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
                           onCheckedChange,
                           size = 'md',
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
        `flex-col-0 items-center justify-center rounded`,
        {
          'text-disabled border-disabled-outline bg-disabled-background cursor-not-allowed': disabled,
          'hover:border-primary': !disabled,
          'bg-input-background': !disabled && !checked,
          'bg-primary/30 border-primary text-primary': !disabled && (checked || indeterminate),
        },
        className
      )}
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
    >
      {!checked && !indeterminate && <div className={clsx('bg-input-background', innerIconSize)}/>}
      {checked && !indeterminate && <Check className={innerIconSize}/>}
      {indeterminate && <Minus className={innerIconSize}/>}
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