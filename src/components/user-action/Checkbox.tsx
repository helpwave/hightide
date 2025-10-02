import { useEffect, useState } from 'react'
import { Check, Minus } from 'lucide-react'
import clsx from 'clsx'
import type { CheckboxProps as RadixCheckboxProps } from '@radix-ui/react-checkbox'
import { CheckboxIndicator as RadixCheckboxIndicator, Root as RadixCheckbox } from '@radix-ui/react-checkbox'

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

export type CheckboxProps = Omit<RadixCheckboxProps, 'checked' | 'onCheckedChange' | 'onChange'> & {
  checked?: boolean,
  indeterminate?: boolean,
  onChange?: (checked: boolean) => void,
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
                           onChange,
                           size = 'md',
                           className = '',
                           ...props
                         }: CheckboxProps) => {
  const usedSizeClass = checkboxSizeMapping[size]
  const innerIconSize = checkboxIconSizeMapping[size]

  return (
    <RadixCheckbox
      {...props}
      disabled={disabled}
      checked={indeterminate ? 'indeterminate' : checked}
      onCheckedChange={onChange}
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
    >
      <RadixCheckboxIndicator>
        {!checked && !indeterminate && <div className={clsx('bg-input-background', innerIconSize)}/>}
        {checked && !indeterminate && <Check className={innerIconSize}/>}
        {indeterminate && <Minus className={innerIconSize}/>}
      </RadixCheckboxIndicator>
    </RadixCheckbox>
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
                                       onChange,
                                       ...props
                                     }: CheckboxUncontrolledProps) => {
  const [checked, setChecked] = useState(initialChecked)

  useEffect(() => {
    setChecked(initialChecked)
  }, [initialChecked])

  return (
    <Checkbox
      {...props}
      checked={checked}
      onChange={(value) => {
        setChecked(value)
        if (onChange) {
          onChange(value)
        }
      }}
    />
  )
}