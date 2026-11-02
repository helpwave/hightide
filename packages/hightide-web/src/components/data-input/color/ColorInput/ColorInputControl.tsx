import clsx from 'clsx'
import type { HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useEffect } from 'react'
import { PropsUtil } from '../../../../utils/propsUtil'
import { useColorInputContext } from './ColorInputContext'

export type ColorInputControlProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode,
}

export const ColorInputControl = forwardRef<HTMLDivElement, ColorInputControlProps>(function ColorInputControl(
  props,
  forwardedRef
) {
  const { state, dispatch, config } = useColorInputContext()

  useEffect(() => {
    if ((config.isReadOnly || config.isDisabled) && state.isOpen) {
      dispatch({ type: 'close' })
    }
  }, [config.isDisabled, config.isReadOnly, dispatch, state.isOpen])

  return (
    <div
      {...props}
      ref={forwardedRef}
      data-value={PropsUtil.dataAttributes.bool(!!state.value)}
      data-alpha={PropsUtil.dataAttributes.bool(config.hasAlpha)}
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
      className={clsx('color-input input-element', props.className)}
    />
  )
})
