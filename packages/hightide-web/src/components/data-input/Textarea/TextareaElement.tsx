import clsx from 'clsx'
import type { TextareaHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { PropsUtil } from '../../../utils/propsUtil'
import type { DataAttributes } from '../../../utils'
import { useTextareaContext } from './TextareaContext'

const Element = 'textarea'

export type TextareaElementProps = TextareaHTMLAttributes<HTMLTextAreaElement> & DataAttributes

export const TextareaElement = forwardRef<HTMLTextAreaElement, TextareaElementProps>(function TextareaElement(
  props,
  forwardedRef
) {
  const { state, dispatch, config } = useTextareaContext()
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
      className={clsx('textarea input-element', props.className)}
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
