import clsx from 'clsx'
import { Check, Minus } from 'lucide-react'
import type { IconSize } from '../visualization/Icon'
import { Icon } from '../visualization/Icon'
import { useCallback, type HTMLAttributes } from 'react'
import { Visibility } from '../layout/Visibility'
import type { InputInterface } from './input/Input'
import { useControlledState } from '@helpwave/hightide-utils/hooks'
import { useEventCallbackStabilizer } from '@helpwave/hightide-utils/hooks'

import { ColoringUtils } from '../../utils/coloring'
import { PropsUtil } from '../../utils/propsUtil'

type CheckBoxSize = 'sm' | 'md' | 'lg' | null

export type CheckboxProps = HTMLAttributes<HTMLDivElement>
  & InputInterface<boolean>
  & {
    indeterminate?: boolean,
    size?: CheckBoxSize,
    alwaysShowCheckIcon?: boolean,
    isRounded?: boolean,
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
  const indicatorSize: IconSize = size === 'sm' ? 'sm' : size === 'lg' ? 'md' : 'sm'

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

      {...ColoringUtils.dataColoringMode('interactive')}
      className={clsx('checkbox', props.className)}>
      <Visibility isVisible={indeterminate}>
        <Icon icon={Minus} size={indicatorSize} className="checkbox-indicator" aria-hidden={true} />
      </Visibility>
      <Visibility isVisible={!indeterminate && (alwaysShowCheckIcon || value)}>
        <Icon icon={Check} size={indicatorSize} className="checkbox-indicator" aria-hidden={true} />
      </Visibility>
    </div>
  )
}