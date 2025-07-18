import { useState } from 'react'
import type { CheckedState } from '@radix-ui/react-checkbox'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check, Minus } from 'lucide-react'
import clsx from 'clsx'
import type { LabelProps } from './Label'
import { Label } from './Label'

type CheckBoxSize = 'small' | 'medium' | 'large'

const checkboxSizeMapping: Record<CheckBoxSize, string> = {
  small: 'size-5',
  medium: 'size-6',
  large: 'size-8',
}

const checkboxIconSizeMapping: Record<CheckBoxSize, string> = {
  small: 'size-4',
  medium: 'size-5',
  large: 'size-7',
}

type CheckboxProps = {
  /** used for the label's `for` attribute */
  id?: string,
  label?: Omit<LabelProps, 'id'>,
  /**
   * @default false
   */
  checked: CheckedState,
  disabled?: boolean,
  onChange?: (checked: boolean) => void,
  onChangeTristate?: (checked: CheckedState) => void,
  size?: CheckBoxSize,
  className?: string,
  containerClassName?: string,
}

/**
 * A Tristate checkbox
 *
 * The state is managed by the parent
 */
const Checkbox = ({
                    id,
                    label,
                    checked,
                    disabled,
                    onChange,
                    onChangeTristate,
                    size = 'medium',
                    className = '',
                    containerClassName
                  }: CheckboxProps) => {
  const usedSizeClass = checkboxSizeMapping[size]
  const innerIconSize = checkboxIconSizeMapping[size]

  const propagateChange = (checked: CheckedState) => {
    if (onChangeTristate) {
      onChangeTristate(checked)
    }
    if (onChange) {
      onChange(checked === 'indeterminate' ? false : checked)
    }
  }

  const changeValue = () => {
    if (disabled) {
      return
    }
    const newValue = checked === 'indeterminate' ? false : !checked
    propagateChange(newValue)
  }

  return (
    <div
      className={clsx('group flex-row-2 items-center', {
        'cursor-pointer': !disabled,
        'cursor-not-allowed': disabled,
      }, containerClassName)}
      onClick={changeValue}
    >
      <CheckboxPrimitive.Root
        onCheckedChange={propagateChange}
        checked={checked}
        disabled={disabled}
        id={id}
        className={clsx(usedSizeClass, `items-center border-2 rounded outline-none `, {
          'text-disabled-text border-disabled-outline bg-disabled-background cursor-not-allowed': disabled,
          'focus:border-primary group-hover:border-primary ': !disabled,
          'bg-input-background': !disabled && !checked,
          'bg-primary/30 border-primary text-primary': !disabled && checked === true || checked === 'indeterminate',
        }, className)}
      >
        <CheckboxPrimitive.Indicator>
          {checked === true && <Check className={innerIconSize}/>}
          {checked === 'indeterminate' && <Minus className={innerIconSize}/>}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label && (
        <Label
          {...label}
          className={clsx(
            label.className,
            {
              'cursor-pointer': !disabled,
              'cursor-not-allowed': disabled,
            }
          )}
          htmlFor={id}
        />
      )}
    </div>
  )
}

type CheckboxUncontrolledProps = Omit<CheckboxProps, 'value' | 'checked'> & {
  /**
   * @default false
   */
  defaultValue?: CheckedState,
}

/**
 * A Tristate checkbox
 *
 * The state is managed by this component
 */
const CheckboxUncontrolled = ({
                                onChange,
                                onChangeTristate,
                                defaultValue = false,
                                ...props
                              }: CheckboxUncontrolledProps) => {
  const [checked, setChecked] = useState(defaultValue)

  const handleChange = (checked: CheckedState) => {
    if (onChangeTristate) {
      onChangeTristate(checked)
    }
    if (onChange) {
      onChange(checked === 'indeterminate' ? false : checked)
    }
    setChecked(checked)
  }

  return (
    <Checkbox
      {...props}
      checked={checked}
      onChangeTristate={handleChange}
    />
  )
}

export {
  CheckboxProps,
  CheckboxUncontrolled,
  Checkbox,
}
