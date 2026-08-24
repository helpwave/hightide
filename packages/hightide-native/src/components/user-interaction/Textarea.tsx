import {
  forwardRef,
  useMemo,
  useState
} from 'react'
import type { TextStyle } from 'react-native'
import {
  StyleSheet,
  TextInput,
  type TextInputProps
} from 'react-native'

import {
  useControlledState,
  useDelay
} from '@helpwave/hightide-utils/hooks'

import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'
import { useTheme } from '../../global-contexts/theme/ThemeContext'
import { useMemoizedTheme } from '../../hooks/useMemoizedTheme'
import type {
  TextareaContainerStyle,
  TextareaState,
  TextareaTextStyle
} from '../../theme/types/components/textarea'
import type { StyleOverwrite } from '../../theme/types/resolver'
import type {
  FormFieldDataHandling,
  FormFieldInteractionStates
} from '../../types/formField'
import type { EditCompleteOptions, EditCompleteOptionsResolved } from './Input'

const defaultEditCompleteOptions: EditCompleteOptionsResolved = {
  allowEnterComplete: false,
  onBlur: true,
  afterDelay: false,
  delay: 2500,
}

export type TextareaProps = Omit<TextInputProps, 'value' | 'style'>
  & Partial<FormFieldDataHandling<string>>
  & Partial<FormFieldInteractionStates>
  & {
    color?: ColorPairToken,
    editCompleteOptions?: EditCompleteOptions,
    initialValue?: string,
    style?: StyleOverwrite<TextareaState, TextareaContainerStyle>,
    textStyle?: StyleOverwrite<TextareaState, TextareaTextStyle>,
  }

export const Textarea = forwardRef<TextInput, TextareaProps>(function Textarea({
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

  const state = useMemo((): TextareaState => ({
    color,
    isDisabled: disabled,
    isInvalid: invalid,
    isReadonly: readOnly,
    isHovered: interactive && isHovered,
    isPressed: interactive && isPressed,
    isFocused: interactive && isFocused,
  }), [color, disabled, invalid, readOnly, interactive, isHovered, isPressed, isFocused])

  const resolvedContainerStyle = useMemoizedTheme(theme.components.textarea.container, state, style)
  const resolvedTextStyle = useMemoizedTheme(theme.components.textarea.text, state, textStyle)
  const resolvedPlaceholderStyle = useMemoizedTheme(theme.components.textarea.placeholder, state)

  const resolvedStyle = useMemo(
    () => {
      const resolvedSheet: TextStyle = StyleSheet.flatten<TextStyle>([
        resolvedContainerStyle,
        resolvedTextStyle,
      ])
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
      multiline
      textAlignVertical="top"
      placeholderTextColor={resolvedPlaceholderStyle.color}
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
      style={resolvedStyle}
      accessibilityState={{ disabled, selected: required }}
    />
  )
})
