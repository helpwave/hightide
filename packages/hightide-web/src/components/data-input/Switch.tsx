import clsx from 'clsx'
import { type HTMLAttributes, useCallback } from 'react'
import type { InputComponentInterface } from './input/Input'
import { useControlledState } from '@helpwave/hightide-utils/hooks'
import { useStableEvent } from '@helpwave/hightide-utils/hooks'
import { ColoringUtils } from '../../utils/coloring'
import { PropsUtil } from '../../utils/propsUtil'

export type SwitchProps = HTMLAttributes<HTMLDivElement>
  & InputComponentInterface<boolean>

/**
 * A binary on/off switch
 *
 * The state is managed by the parent.
 */
export const Switch = ({
  value: controlledValue,
  initialValue = false,
  required = false,
  invalid = false,
  disabled = false,
  readOnly = false,
  onValueUpdate: onValueChange,
  onValueCommit: onEditComplete,
  ...props
}: SwitchProps) => {
  const onEditCompleteStable = useStableEvent(onEditComplete)
  const onValueChangeStable = useStableEvent(onValueChange)

  const onChangeWrapper = useCallback((value: boolean) => {
    onValueChangeStable(!value)
    onEditCompleteStable(!value)
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
        if (!disabled && !readOnly) {
          setValue(prev => !prev)
          props.onClick?.(event)
        }
      }}
      onKeyDown={(event) => {
        if (disabled || readOnly) return
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault()
          setValue(prev => !prev)
          props.onKeyDown?.(event)
        }
      }}

      role="switch"
      tabIndex={disabled ? -1 : 0}
      aria-checked={value}
      {...PropsUtil.aria.interactionStates({ disabled, invalid, readOnly, required }, props)}

      {...ColoringUtils.dataColoringMode('interactive')}
      className={clsx('switch', props.className)}
      data-active={PropsUtil.dataAttributes.bool(value)}
      {...PropsUtil.dataAttributes.interactionStates({ disabled, invalid, readOnly, required })}>
      <div className="switch-track">
        <div data-active={PropsUtil.dataAttributes.bool(value)} className="switch-thumb" />
      </div>
    </div>
  )
}


