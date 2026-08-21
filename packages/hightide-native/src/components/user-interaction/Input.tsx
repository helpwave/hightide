import {
  forwardRef,
  useMemo,
  useState
} from 'react'
import type {
  TextStyle } from 'react-native'
import {
  StyleSheet,
  TextInput,
  type TextInputProps
} from 'react-native'

import {
  useControlledState,
  useDelay,
  type UseDelayOptionsResolved
} from '@helpwave/hightide-utils/hooks'

import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'
import { useTheme } from '../../global-contexts/theme/ThemeContext'
import type {
  InputContainerStyle,
  InputState,
  InputTextStyle
} from '../../theme/types/components/input'
import type { StyleOverwrite } from '../../theme/types/resolver'
import type {
  FormFieldDataHandling,
  FormFieldInteractionStates
} from '../../types/formField'

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
    color?: ColorPairToken,
    editCompleteOptions?: EditCompleteOptions,
    initialValue?: string,
    style?:  StyleOverwrite<InputState, InputContainerStyle>,
    textStyle?: StyleOverwrite<InputState, InputTextStyle>,
  }

export const Input = forwardRef<TextInput, InputProps>(function Input({
  value: controlledValue,
  initialValue,
  color,
  invalid = false,
  disabled = false,
  readOnly = false,
  required = false,
  onValueChange,
  onEditComplete,
  editCompleteOptions,
  style,
  textStyle,
  ...props
}, ref) {
  const { theme } = useTheme()
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

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

  const interactive = !disabled && !readOnly

  const state = useMemo((): InputState => ({
    color,
    isDisabled: disabled,
    isInvalid: invalid,
    isReadonly: readOnly,
    isHovered: interactive && isHovered,
    isPressed: interactive && isPressed,
    isFocused: interactive && isFocused,
  }), [color, disabled, invalid, readOnly, interactive, isHovered, isPressed, isFocused])

  const resolvedContainerStyle = useMemo(
    () => theme.components.input.container(state, style),
    [theme, state, style]
  )
  const resolvedTextStyle = useMemo(
    () => theme.components.input.text(state, textStyle),
    [theme, state, textStyle]
  )
  const resolvedPlaceholderStyle = useMemo(
    () => theme.components.input.placeholder(state),
    [theme, state]
  )


  const resolvedStyle = useMemo(
    () => {
      const resolvedSheet: TextStyle = StyleSheet.flatten<TextStyle>([
        resolvedContainerStyle,
        resolvedTextStyle,
      ])
      // this is required for android to work
      // TODO find a better solution like separating container and text input
      delete resolvedSheet['boxShadow']
      return resolvedSheet
    },
    [resolvedContainerStyle, resolvedTextStyle]
  )

  return (
    <TextInput
      {...props}
      ref={ref}
      value={value}
      editable={interactive}
      onChangeText={(nextValue) => {
        props.onChangeText?.(nextValue)
        restartTimer(() => {
          onEditComplete?.(nextValue)
        })
        setValue(nextValue)
      }}
      onFocus={(event) => {
        if (interactive) {
          setIsFocused(true)
        }
        props.onFocus?.(event)
      }}
      onBlur={(event) => {
        setIsFocused(false)
        props.onBlur?.(event)
        if (allowEditCompleteOnBlur) {
          onEditComplete?.(value ?? '')
          clearTimer()
        }
      }}
      onPressIn={(event) => {
        if (interactive) {
          setIsPressed(true)
        }
        props.onPressIn?.(event)
      }}
      onPressOut={(event) => {
        setIsPressed(false)
        props.onPressOut?.(event)
      }}
      onPointerEnter={(event) => {
        if (interactive) {
          setIsHovered(true)
        }
        props.onPointerEnter?.(event)
      }}
      onPointerLeave={(event) => {
        setIsHovered(false)
        props.onPointerLeave?.(event)
      }}
      onSubmitEditing={(event) => {
        props.onSubmitEditing?.(event)
        if (allowEnterComplete) {
          onEditComplete?.(value ?? '')
          clearTimer()
        }
      }}
      placeholderTextColor={resolvedPlaceholderStyle.color}
      style={resolvedStyle}
      accessibilityState={{ disabled, selected: required }}
    />
  )
})
