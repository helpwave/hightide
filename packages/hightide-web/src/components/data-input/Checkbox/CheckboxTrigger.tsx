import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { ColoringUtils } from '../../../utils/coloring'
import { PropsUtil } from '../../../utils/propsUtil'
import { useCheckboxContext } from './CheckboxContext'

export type CheckboxSize = 'sm' | 'md' | 'lg' | null

export type CheckboxTriggerProps = HTMLAttributes<HTMLDivElement> & {
  indeterminate?: boolean,
  size?: CheckboxSize,
  isRounded?: boolean,
}

export const CheckboxTrigger = forwardRef<HTMLDivElement, CheckboxTriggerProps>(function CheckboxTrigger({
  indeterminate = false,
  size = 'md',
  isRounded = false,
  children,
  ...props
}, forwardedRef) {
  const { state, dispatch, config } = useCheckboxContext()
  // TODO checkboxes do not have a readonly state, consider removing it or adding a description for accessibility
  const { isInvalid, isDisabled, isReadOnly, isRequired } = config
  const isInteractive = !isDisabled && !isReadOnly

  return (
    <div
      {...props}
      ref={forwardedRef}
      onClick={(event) => {
        props.onClick?.(event)
        if (isInteractive) {
          dispatch({ type: 'toggle' })
        }
      }}
      onKeyDown={(event) => {
        props.onKeyDown?.(event)
        if (!isInteractive) {
          return
        }
        if (event.key === ' ') {
          event.preventDefault()
          dispatch({ type: 'toggle' })
        }
      }}
      data-checked={indeterminate ? 'indeterminate' : String(state.value)}
      data-size={size ?? undefined}
      data-rounded={isRounded ? '' : undefined}
      {...PropsUtil.dataAttributes.interactionStates({
        invalid: isInvalid,
        disabled: isDisabled,
        readOnly: isReadOnly,
        required: isRequired,
      })}
      role="checkbox"
      tabIndex={isDisabled ? -1 : 0}
      aria-checked={indeterminate ? 'mixed' : state.value}
      {...PropsUtil.aria.interactionStates({
        invalid: isInvalid,
        disabled: isDisabled,
        readOnly: isReadOnly,
        required: isRequired,
      }, props)}
      {...ColoringUtils.dataColoringMode('interactive')}
      className={clsx('checkbox', props.className)}
    >
      {children}
    </div>
  )
})
