import clsx from 'clsx'
import type { InputHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { useColorInputContext } from './ColorInputContext'

export type ColorInputFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'type' | 'maxLength'>

export const ColorInputField = forwardRef<HTMLInputElement, ColorInputFieldProps>(function ColorInputField(
  props,
  forwardedRef
) {
  const { state, dispatch, config } = useColorInputContext()
  const shown = config.hasAlpha ? state.text : state.text.slice(0, 7)

  return (
    <input
      {...props}
      ref={forwardedRef}
      type="text"
      inputMode="text"
      autoCapitalize={config.isCapitalized ? 'characters' : 'off'}
      autoCorrect="off"
      spellCheck={false}
      maxLength={config.hasAlpha ? 9 : 7}
      value={shown}
      disabled={config.isDisabled}
      readOnly={config.isReadOnly}
      required={config.isRequired}
      onFocus={(event) => {
        props.onFocus?.(event)
        dispatch({ type: 'focus' })
      }}
      onBlur={(event) => {
        props.onBlur?.(event)
        dispatch({ type: 'blur' })
      }}
      onKeyDown={(event) => {
        props.onKeyDown?.(event)
        if (event.key !== 'Enter' || event.defaultPrevented) return
        event.preventDefault()
        dispatch({ type: 'commitText' })
      }}
      onChange={(event) => {
        props.onChange?.(event)
        dispatch({ type: 'textChange', text: event.target.value })
      }}
      className={clsx('color-input-field', config.isCapitalized ? 'uppercase' : 'lowercase', props.className)}
    />
  )
})
