import type { ReactNode } from 'react'
import {
  TextInput,
  View,
  type StyleProp,
  type TextStyle,
  type ViewProps,
  type ViewStyle
} from 'react-native'
import { SendHorizontal } from 'lucide-react-native'
import { useControlledState } from '@helpwave/hightide-utils/hooks'
import { IconButton } from '../user-interaction/IconButton'
import { useTheme } from '../../global-contexts/theme'
import type { ChatMessageComposerStyle } from '../../theme'

export type ChatMessageComposerProps = Omit<ViewProps, 'style'> & {
  value?: string,
  initialValue?: string,
  onValueChange?: (value: string) => void,
  onSend: (value: string) => void,
  placeholder?: string,
  sendLabel?: string,
  disabled?: boolean,
  actions?: ReactNode,
  trailing?: ReactNode,
  style?: StyleProp<ViewStyle>,
  composerStyle?: StyleProp<ViewStyle> | ((style: ChatMessageComposerStyle) => StyleProp<ViewStyle>),
  inputStyle?: StyleProp<TextStyle>,
}

export const ChatMessageComposer = ({
  value: controlledValue,
  initialValue,
  onValueChange,
  onSend,
  placeholder,
  sendLabel = 'Send',
  disabled = false,
  actions,
  trailing,
  style,
  composerStyle,
  inputStyle,
  ...props
}: ChatMessageComposerProps) => {
  const { theme } = useTheme()
  const [value, setValue] = useControlledState({
    value: controlledValue,
    onValueChange,
    defaultValue: initialValue ?? '',
  })

  const resolvedComposer = theme.components.chat.messageComposer({})
  const resolvedInput = theme.components.chat.messageComposerInput({})
  const placeholderColor = theme.components.chat.messageComposerPlaceholderColor({})

  const appliedComposer = typeof composerStyle === 'function'
    ? composerStyle(resolvedComposer)
    : [resolvedComposer, composerStyle]

  const send = () => {
    const trimmed = (value ?? '').trim()
    if (!trimmed || disabled) {
      return
    }
    onSend(trimmed)
    setValue('')
  }

  return (
    <View {...props} style={[appliedComposer, style]}>
      {actions != null && (
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          {actions}
        </View>
      )}
      <TextInput
        value={value ?? ''}
        onChangeText={setValue}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        editable={!disabled}
        multiline
        style={[resolvedInput, inputStyle]}
        onSubmitEditing={send}
        returnKeyType="send"
      />
      {trailing}
      <IconButton
        accessibilityLabel={sendLabel}
        color="primary"
        coloringStyle="solid"
        disabled={disabled || !(value ?? '').trim()}
        size="md"
        onPress={send}
        icon={SendHorizontal}
        buttonStyle={(buttonStyle) => ({
          ...buttonStyle,
          borderRadius: 999,
        })}
      />
    </View>
  )
}
