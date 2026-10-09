import clsx from 'clsx'
import type { HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useCallback, useId } from 'react'
import { Checkbox, type CheckboxProps } from './Checkbox'
import { PropsUtil } from '../../utils/propsUtil'
import type { InputComponentInterface } from './input/TextInput'
import { useControlledState } from '@helpwave/hightide-utils/hooks'
import { useStableEvent } from '@helpwave/hightide-utils/hooks'

type LabelledCheckboxCheckPosition = 'left' | 'right'

export type LabelledCheckboxProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>
  & InputComponentInterface<boolean>
  & Pick<CheckboxProps, 'indeterminate' | 'size' | 'alwaysShowCheckIcon' | 'isRounded'>
  & {
    label: ReactNode,
    checkPosition?: LabelledCheckboxCheckPosition,
    checkboxClassName?: string,
    labelClassName?: string,
  }

/**
 * A checkbox with a label that toggles the checkbox when the container is clicked
 */
export const LabelledCheckbox = forwardRef<HTMLDivElement, LabelledCheckboxProps>(function LabelledCheckbox({
  value: controlledValue,
  initialValue = false,
  onValueUpdate: onValueChange,
  onValueCommit: onEditComplete,
  indeterminate,
  required = false,
  invalid = false,
  disabled = false,
  readOnly = false,
  size = 'md',
  alwaysShowCheckIcon = false,
  isRounded = false,
  label,
  checkPosition = 'left',
  checkboxClassName,
  labelClassName,
  className,
  id: customId,
  ...props
}, forwardedRef) {
  const generatedId = useId()
  const id = customId ?? generatedId
  const labelId = `${id}-label`

  const onEditCompleteStable = useStableEvent(onEditComplete)
  const onValueChangeStable = useStableEvent(onValueChange)
  const onChangeWrapper = useCallback((value: boolean) => {
    onValueChangeStable(value)
    onEditCompleteStable(value)
  }, [onValueChangeStable, onEditCompleteStable])

  const [value, setValue] = useControlledState({
    value: controlledValue,
    onValueChange: onChangeWrapper,
    defaultValue: initialValue,
  })

  const toggle = useCallback(() => {
    if (disabled || readOnly) {
      return
    }
    setValue(prev => !prev)
  }, [disabled, readOnly, setValue])

  const checkbox = (
    <Checkbox
      value={value}
      onValueChange={setValue}
      indeterminate={indeterminate}
      isRequired={required}
      isInvalid={invalid}
      isDisabled={disabled}
      isReadOnly={readOnly}
      size={size}
      alwaysShowCheckIcon={alwaysShowCheckIcon}
      isRounded={isRounded}
      triggerProps={{
        className: checkboxClassName,
        onClick: (event) => event.stopPropagation(),
        onKeyDown: (event) => event.stopPropagation(),
      }}
    />
  )

  const labelElement = (
    <label
      id={labelId}
      className={clsx('labelled-checkbox-label', labelClassName)}
    >
      {label}
    </label>
  )

  return (
    <div
      {...props}
      ref={forwardedRef}

      onClick={(event) => {
        toggle()
        props.onClick?.(event)
      }}
      onKeyDown={(event) => {
        if (disabled || readOnly) {
          return
        }
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault()
          toggle()
        }
        props.onKeyDown?.(event)
      }}

      className={clsx('labelled-checkbox-container', className)}
      data-check-position={checkPosition}
      data-checked={!indeterminate ? value : 'indeterminate'}
      data-size={size ?? undefined}
      {...PropsUtil.dataAttributes.interactionStates({ disabled, invalid, readOnly, required })}

      id={id}
      {...PropsUtil.aria.interactionStates({ disabled, invalid, readOnly, required }, props)}
    >
      {checkPosition === 'left' ? checkbox : labelElement}
      {checkPosition === 'left' ? labelElement : checkbox}
    </div>
  )
})
