import clsx from 'clsx'
import type { CSSProperties, InputHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { MathUtil } from '@helpwave/hightide-utils/utils'
import { PropsUtil } from '../../../../utils/propsUtil'
import { useNumberInputContext } from './NumberInputContext'

export type NumberInputInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'type' | 'min' | 'max'> & {
  minimum?: number,
  maximum?: number,
  approximateMaxCharacters?: number,
  formatDisplayedValue?: (value: number) => string,
  parseDisplayedValue?: (rawValue: string) => number | undefined,
}

export const NumberInputInput = forwardRef<HTMLInputElement, NumberInputInputProps>(function NumberInputInput({
  minimum,
  maximum,
  approximateMaxCharacters = 6,
  formatDisplayedValue,
  parseDisplayedValue,
  ...props
}, forwardedRef) {
  const { state, dispatch, config } = useNumberInputContext()
  const displayed = Number.isFinite(state.value)
    ? (formatDisplayedValue?.(Math.round(state.value)) ?? String(Math.round(state.value)))
    : ''

  return (
    <input
      {...props}
      ref={forwardedRef}
      type="text"
      inputMode="numeric"
      value={displayed}
      disabled={config.isDisabled}
      readOnly={config.isReadOnly}
      required={config.isRequired}
      min={minimum}
      max={maximum}
      onChange={(event) => {
        props.onChange?.(event)
        const parsed = parseDisplayedValue?.(event.target.value) ?? Number(event.target.value)
        dispatch({ type: 'change', value: MathUtil.clamp(parsed, minimum, maximum) })
      }}
      onBlur={(event) => {
        props.onBlur?.(event)
        dispatch({ type: 'commit', value: state.value })
      }}
      data-value={PropsUtil.dataAttributes.bool(Number.isFinite(state.value))}
      {...PropsUtil.dataAttributes.interactionStates({
        disabled: config.isDisabled,
        invalid: config.isInvalid,
        readOnly: config.isReadOnly,
        required: config.isRequired,
      })}
      {...PropsUtil.aria.interactionStates({
        disabled: config.isDisabled,
        invalid: config.isInvalid,
        readOnly: config.isReadOnly,
        required: config.isRequired,
      }, props)}
      className={clsx('input-element number-input', props.className)}
      style={{
        ...props.style,
        '--number-input-approximate-max-characters': approximateMaxCharacters,
      } as CSSProperties}
    />
  )
})
