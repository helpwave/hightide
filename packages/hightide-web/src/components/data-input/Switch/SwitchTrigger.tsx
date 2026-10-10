import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { ColoringUtils } from '../../../utils/coloring'
import { PropsUtil } from '../../../utils/propsUtil'
import { useSwitchContext } from './SwitchContext'

export type SwitchTriggerProps = HTMLAttributes<HTMLDivElement>

export const SwitchTrigger = forwardRef<HTMLDivElement, SwitchTriggerProps>(function SwitchTrigger({
  children,
  ...props
}, forwardedRef) {
  const { state, dispatch, config } = useSwitchContext()
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
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault()
          dispatch({ type: 'toggle' })
        }
      }}
      role="switch"
      tabIndex={isDisabled ? -1 : 0}
      aria-checked={state.value}
      {...PropsUtil.aria.interactionStates({
        invalid: isInvalid,
        disabled: isDisabled,
        readOnly: isReadOnly,
        required: isRequired,
      }, props)}
      {...ColoringUtils.dataColoringMode('interactive')}
      className={clsx('switch', props.className)}
      data-active={PropsUtil.dataAttributes.bool(state.value)}
      {...PropsUtil.dataAttributes.interactionStates({
        invalid: isInvalid,
        disabled: isDisabled,
        readOnly: isReadOnly,
        required: isRequired,
      })}
    >
      {children}
    </div>
  )
})
