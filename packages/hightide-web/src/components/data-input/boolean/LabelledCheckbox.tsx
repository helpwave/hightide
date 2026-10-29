import clsx from 'clsx'
import type { HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useCallback, useId } from 'react'
import type { ControllableInputProps } from '@helpwave/hightide-utils/interfaces'
import { Checkbox, type CheckboxProps } from './Checkbox'
import { PropsUtil } from '../../../utils/propsUtil'
import { useControlledState, useStableEvent } from '@helpwave/hightide-utils/hooks'

type LabelledCheckboxCheckPosition = 'left' | 'right'

export type LabelledCheckboxEvent = { type: 'commit', value: boolean }

export type LabelledCheckboxProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>
  & ControllableInputProps<boolean, LabelledCheckboxEvent>
  & Pick<CheckboxProps, 'indeterminate' | 'size' | 'alwaysShowCheckIcon' | 'isRounded'>
  & {
    label: ReactNode,
    checkPosition?: LabelledCheckboxCheckPosition,
    checkboxClassName?: string,
    labelClassName?: string,
  }

export const LabelledCheckbox = forwardRef<HTMLDivElement, LabelledCheckboxProps>(function LabelledCheckbox({
  value: controlledValue,
  initialValue = false,
  onValueChange,
  onStateEvent,
  indeterminate,
  isRequired = false,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
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

  const onStateEventStable = useStableEvent(onStateEvent)
  const onValueChangeStable = useStableEvent(onValueChange)
  const onChangeWrapper = useCallback((value: boolean) => {
    onValueChangeStable(value)
    onStateEventStable?.({ type: 'commit', value })
  }, [onStateEventStable, onValueChangeStable])

  const [value, setValue] = useControlledState({
    value: controlledValue,
    onValueChange: onChangeWrapper,
    defaultValue: initialValue,
  })

  const toggle = useCallback(() => {
    if (isDisabled || isReadOnly) {
      return
    }
    setValue(prev => !prev)
  }, [isDisabled, isReadOnly, setValue])

  const checkbox = (
    <Checkbox
      value={value}
      onValueChange={setValue}
      indeterminate={indeterminate}
      isRequired={isRequired}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
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
        if (isDisabled || isReadOnly) {
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
      {...PropsUtil.dataAttributes.interactionStates({ disabled: isDisabled, invalid: isInvalid, readOnly: isReadOnly, required: isRequired })}

      id={id}
      {...PropsUtil.aria.interactionStates({ disabled: isDisabled, invalid: isInvalid, readOnly: isReadOnly, required: isRequired }, props)}
    >
      {checkPosition === 'left' ? checkbox : labelElement}
      {checkPosition === 'left' ? labelElement : checkbox}
    </div>
  )
})
