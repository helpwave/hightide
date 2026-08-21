import { forwardRef } from 'react'
import type { TextInput } from 'react-native'

import { useTheme } from '../../global-contexts/theme/ThemeContext'
import { Input, type InputProps } from './Input'

export type TextareaProps = InputProps

export const Textarea = forwardRef<TextInput, TextareaProps>(function Textarea({
  style,
  textStyle,
  ...props
}, ref) {
  const { theme } = useTheme()

  return (
    <Input
      {...props}
      ref={ref}
      multiline
      textAlignVertical="top"
      style={(state) => theme.components.textarea.container(state, style)}
      textStyle={(state) => theme.components.textarea.text(state, textStyle)}
    />
  )
})
