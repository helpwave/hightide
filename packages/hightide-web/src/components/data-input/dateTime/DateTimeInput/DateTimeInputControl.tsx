import clsx from 'clsx'
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useEffect } from 'react'
import { PropsUtil } from '../../../../utils/propsUtil'
import { useDateTimeInputContext } from './DateTimeInputContext'

export type DateTimeInputControlProps = HTMLAttributes<HTMLDivElement> & {
  actionCount: number,
  children?: ReactNode,
}

export const DateTimeInputControl = forwardRef<HTMLDivElement, DateTimeInputControlProps>(function DateTimeInputControl({
  actionCount,
  children,
  ...props
}, forwardedRef) {
  const { state, dispatch, config } = useDateTimeInputContext()

  useEffect(() => {
    if ((config.isReadOnly || config.isDisabled) && state.isOpen) {
      dispatch({ type: 'close' })
    }
  }, [config.isDisabled, config.isReadOnly, dispatch, state.isOpen])

  return (
    <div
      {...props}
      ref={forwardedRef}
      tabIndex={-1}
      onFocus={(event) => {
        props.onFocus?.(event)
        if (event.target === event.currentTarget && !config.isDisabled) {
          event.currentTarget.querySelector<HTMLElement>('.date-time-segment')?.focus()
        }
      }}
      data-value={PropsUtil.dataAttributes.bool(!!state.value)}
      data-has-actions={PropsUtil.dataAttributes.bool(actionCount > 0)}
      {...PropsUtil.dataAttributes.interactionStates({
        disabled: config.isDisabled,
        readOnly: config.isReadOnly,
        invalid: config.isInvalid,
        required: config.isRequired,
      })}
      {...PropsUtil.aria.interactionStates({
        disabled: config.isDisabled,
        readOnly: config.isReadOnly,
        invalid: config.isInvalid,
        required: config.isRequired,
      }, props)}
      className={clsx('date-time-input input-element', props.className)}
      style={{
        '--action-count': actionCount,
        ...props.style,
      } as CSSProperties}
    >
      {children}
    </div>
  )
})
