import clsx from 'clsx'
import type { InputHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { PropsUtil } from '../../../../utils/propsUtil'
import { useTextInputContext } from './TextInputContext'
import type { DataAttributes } from '../../../../utils'

const Element = 'input'

export type TextInputElementProps = InputHTMLAttributes<HTMLInputElement> & DataAttributes

export const TextInputElement = forwardRef<HTMLInputElement, TextInputElementProps>(function TextInputElement(
  props,
  forwardedRef
) {
  const { state, dispatch, config } = useTextInputContext()
  const { isInvalid, isDisabled, isReadOnly, isRequired } = config

  return (
    <Element
      {...props}
      value={state.value}
      ref={forwardedRef}
      disabled={isDisabled}
      readOnly={isReadOnly}
      required={isRequired}
      onFocus={event => {
        props.onFocus?.(event)
        dispatch({ type: 'focus' })
      }}
      onBlur={event => {
        props.onBlur?.(event)
        dispatch({ type: 'blur' })
      }}
      onCompositionStart={event => {
        props.onCompositionStart?.(event)
        dispatch({ type: 'compositionStart' })
      }}
      onCompositionEnd={event => {
        props.onCompositionEnd?.(event)
        dispatch({ type: 'compositionEnd' })
      }}
      onChange={event => {
        props.onChange?.(event)
        dispatch({ type: 'change', value: event.target.value })
      }}
      className={clsx('text-input input-element', props.className)}
      data-value={PropsUtil.dataAttributes.bool(!!state.value)}
      {...PropsUtil.dataAttributes.interactionStates({
        invalid: isInvalid,
        disabled: isDisabled,
        readOnly: isReadOnly,
        required: isRequired,
      })}
      {...PropsUtil.aria.interactionStates({
        invalid: isInvalid,
        disabled: isDisabled,
        readOnly: isReadOnly,
        required: isRequired,
      }, props)}
    />
  )
})
