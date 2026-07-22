import {
  forwardRef,
  useMemo
} from 'react'
import {
  TextInput,
  type StyleProp,
  type TextInputProps,
  type TextStyle
} from 'react-native'

import {
  useControlledState,
  useDelay,
  type UseDelayOptionsResolved
} from '@helpwave/hightide-utils/hooks'

import { useTheme } from '@/src/global-contexts/theme/ThemeContext'
import type {
  InputState,
  InputStyle
} from '@/src/theme/types/components/input'
import type { StyleOverwrite } from '@/src/theme/types/resolver'
import type {
  FormFieldDataHandling,
  FormFieldInteractionStates
} from '@/src/types/formField'

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
    inputStyle?: StyleOverwrite<InputState, InputStyle>,
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

  const state = useMemo((): InputState => ({
    isDisabled: disabled,
    isInvalid: invalid,
    isReadOnly: readOnly,
  }), [disabled, invalid, readOnly])

  const resolvedInputStyle = useMemo(
    () => theme.components.input.input(state, inputStyle),
    [theme, state, inputStyle]
  )
  const placeholderColor = useMemo(
    () => theme.components.input.placeholderColor(state),
    [theme, state]
  )

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
      placeholderTextColor={placeholderColor}
      style={[resolvedInputStyle, style]}
      accessibilityState={{ disabled, selected: required }}
    />
  )
})
