import { getComponentColors, getSemanticColors, inputElementSizes, remToPx } from '@helpwave/hightide-design'
import type { UseDelayOptionsResolved } from '@helpwave/hightide-utils'
import { useControlledState, useDelay } from '@helpwave/hightide-utils'
import { forwardRef } from 'react'
import { TextInput, type StyleProp, type TextInputProps, type TextStyle } from 'react-native'
import { useThemeMode } from '../../theme/ThemeContext'
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
  ...props
}, ref) {
  const mode = useThemeMode()
  const semantic = getSemanticColors(mode)
  const component = getComponentColors(mode)
  const sizing = inputElementSizes.md

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

  const borderColor = invalid ? semantic.negative : component.border

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
      placeholderTextColor={semantic.placeholder}
      style={[
        {
          minHeight: remToPx(sizing.height),
          paddingHorizontal: remToPx(sizing.paddingX),
          paddingVertical: remToPx(sizing.paddingY),
          borderRadius: remToPx(sizing.borderRadius),
          borderWidth: 1,
          borderColor,
          backgroundColor: disabled ? semantic.disabled : component.input.background,
          color: disabled ? semantic.onDisabled : component.input.text,
          fontSize: 14,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      accessibilityState={{ disabled, selected: required }}
    />
  )
})
