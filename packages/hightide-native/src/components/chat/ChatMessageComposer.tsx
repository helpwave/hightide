import {
  useMemo,
  type ReactNode
} from 'react'
import {
  TextInput,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle
} from 'react-native'

import { useControlledState } from '@helpwave/hightide-utils/hooks'

import { HightideIconRegistry } from '../../icons/HightideIconRegistry'
import { IconButton } from '../user-interaction/IconButton'
import { useTheme } from '../../global-contexts/theme/ThemeContext'
import { useMemoizedTheme } from '../../hooks/useMemoizedTheme'
import type {
  ChatMessageComposerInputStyle,
  ChatMessageComposerStyle
} from '../../theme/types/components/chat'
import type { StyleOverwrite } from '../../theme/types/resolver'
import { StyleAdapterUtils } from '../../theme'

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
  composerStyle?: StyleOverwrite<Record<string, never>, ChatMessageComposerStyle>,
  inputStyle?: StyleOverwrite<Record<string, never>, ChatMessageComposerInputStyle>,
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
  const state = useMemo(() => ({}), [])

  const resolvedComposerStyle = useMemoizedTheme(theme.components.chat.messageComposer.container, state, composerStyle)
  const resolvedInputStyle = useMemoizedTheme(theme.components.chat.messageComposer.input, state, inputStyle)
  const placeholderColor = useMemoizedTheme(theme.components.chat.messageComposer.placeholderColor, state)

  const send = () => {
    const trimmed = (value ?? '').trim()
    if (!trimmed || disabled) {
      return
    }
    onSend(trimmed)
    setValue('')
  }

  return (
    <View {...props} style={[resolvedComposerStyle, style]}>
      {actions != null && (
        <View style={{ flexDirection: 'row' }}>
          {actions}
        </View>
      )}
      <TextInput
        value={value ?? ''}
        onChangeText={setValue}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor.color}
        editable={!disabled}
        multiline
        style={resolvedInputStyle}
        onSubmitEditing={send}
        returnKeyType="send"
      />
      <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
        {trailing}
        <IconButton
          icon={HightideIconRegistry.SendHorizontal}
          accessibilityLabel={sendLabel}
          variant="filled"
          disabled={disabled || !(value ?? '').trim()}
          size="sm"
          onPress={send}
          style={{ ...StyleAdapterUtils.borderRadius({ type: 'all', value: 999 }) }}
          stateLayerStyle={{ ...StyleAdapterUtils.borderRadius({ type: 'all', value: 999 }) }}
        />
      </View>
    </View>
  )
}
