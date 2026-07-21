import {
  useControlledState,
  useDelay,
  type UseDelayOptionsResolved
} from '@helpwave/hightide-utils/hooks'
import { forwardRef } from 'react'
import { TextInput, type StyleProp, type TextInputProps, type TextStyle } from 'react-native'
import { useTheme } from '../../global-contexts/theme'
import type { InputState, InputStyle } from '../../theme'
import type { FormFieldDataHandling, FormFieldInteractionStates } from '../../types/formField'

export type EditCompleteOptionsResolved = {
  onBlur: boolean,
  afterDelay: boolean,
  allowEnterComplete?: boolean,
} & Omit<UseDelayOptionsResolved, 'disabled'>

export type EditCompleteOptions = Partial<EditCompleteOptionsResolved>

const defaultEditCompleteOptions: EditCompleteOptionsResolved = {
  allowEnterComplete: false,
  onBlur: true,
  afterDelay: false,
  delay: 2500,
}

export type InputProps = Omit<TextInputProps, 'value' | 'style'>
  & Partial<FormFieldDataHandling<string>>
  & Partial<FormFieldInteractionStates>
  & {
    editCompleteOptions?: EditCompleteOptions,
    initialValue?: string,
    style?: StyleProp<TextStyle>,
    inputStyle?: StyleProp<TextStyle> | ((style: InputStyle) => StyleProp<TextStyle>),
  }

export const Input = forwardRef<TextInput, InputProps>(function Input({
  value: controlledValue,
  initialValue,
  invalid = false,
  disabled = false,
  readOnly = false,
  required = false,
  onValueChange,
  onEditComplete,
  editCompleteOptions,
  style,
  inputStyle,
  ...props
}, ref) {
  const { theme } = useTheme()

  const [value, setValue] = useControlledState({
    value: controlledValue,
    onValueChange,
    defaultValue: initialValue,
  })

  const {
    onBlur: allowEditCompleteOnBlur,
    afterDelay,
    delay,
    allowEnterComplete,
  } = { ...defaultEditCompleteOptions, ...editCompleteOptions }

  const { restartTimer, clearTimer } = useDelay({
    delay,
    disabled: !afterDelay || disabled || readOnly,
  })

  const state: InputState = {
    isDisabled: disabled,
    isInvalid: invalid,
    isReadOnly: readOnly,
  }

  const resolvedInput = theme.components.input.input(state)
  const appliedInputStyle = typeof inputStyle === 'function'
    ? inputStyle(resolvedInput)
    : [resolvedInput, inputStyle]

  return (
    <TextInput
      {...props}
      ref={ref}
      value={value}
      editable={!disabled && !readOnly}
      onChangeText={(nextValue) => {
        props.onChangeText?.(nextValue)
        restartTimer(() => {
          onEditComplete?.(nextValue)
        })
        setValue(nextValue)
      }}
      onBlur={(event) => {
        props.onBlur?.(event)
        if (allowEditCompleteOnBlur) {
          onEditComplete?.(value ?? '')
          clearTimer()
        }
      }}
      onSubmitEditing={(event) => {
        props.onSubmitEditing?.(event)
        if (allowEnterComplete) {
          onEditComplete?.(value ?? '')
          clearTimer()
        }
      }}
      placeholderTextColor={theme.components.input.placeholderColor(state)}
      style={[appliedInputStyle, style]}
      accessibilityState={{ disabled, selected: required }}
    />
  )
})
