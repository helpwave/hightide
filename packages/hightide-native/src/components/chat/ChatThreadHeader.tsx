import {
  useMemo,
  useState,
  type ReactNode
} from 'react'
import {
  View,
  type PressableProps,
  type StyleProp,
  type ViewProps,
  type ViewStyle
} from 'react-native'

import { useTheme } from '../../global-contexts/theme/ThemeContext'
import { useMemoizedTheme } from '../../hooks/useMemoizedTheme'
import { ThemedText } from '../visualization-and-display/ThemedText'
import {
  Avatar,
  type AvatarProps
} from '../visualization-and-display/Avatar'
import type {
  ChatThreadHeaderContentRowStyle,
  ChatThreadHeaderStyle,
  ChatThreadHeaderSubtitleStyle,
  ChatThreadHeaderTitleStyle,
  PressableContainerStyle,
  PressableState
} from '../../theme/types/components/chat'
import type { StyleOverwrite } from '../../theme/types/resolver'
import { ThemedPressable } from '../user-interaction'

export type ChatThreadHeaderProps = Omit<ViewProps, 'style'> & {
  avatar?: AvatarProps,
  title: ReactNode,
  subtitle?: ReactNode,
  leftActions?: ReactNode,
  rightActions?: ReactNode,
  onPress?: PressableProps['onPress'],
  disabled?: boolean,
  style?: StyleProp<ViewStyle>,
  headerStyle?: StyleOverwrite<Record<string, never>, ChatThreadHeaderStyle>,
  contentRowStyle?: StyleOverwrite<Record<string, never>, ChatThreadHeaderContentRowStyle>,
  titleStyle?: StyleOverwrite<Record<string, never>, ChatThreadHeaderTitleStyle>,
  subtitleStyle?: StyleOverwrite<Record<string, never>, ChatThreadHeaderSubtitleStyle>,
  pressableContainerStyle?: StyleOverwrite<PressableState, PressableContainerStyle>,
}

type ChatThreadHeaderPressableContentProps = {
  avatar?: AvatarProps,
  title: ReactNode,
  subtitle?: ReactNode,
  disabled?: boolean,
  onPress?: PressableProps['onPress'],
  contentRowStyle?: StyleOverwrite<Record<string, never>, ChatThreadHeaderContentRowStyle>,
  titleStyle?: StyleOverwrite<Record<string, never>, ChatThreadHeaderTitleStyle>,
  subtitleStyle?: StyleOverwrite<Record<string, never>, ChatThreadHeaderSubtitleStyle>,
  pressableContainerStyle?: StyleOverwrite<PressableState, PressableContainerStyle>,
}

const ChatThreadHeaderPressableContent = ({
  avatar,
  title,
  subtitle,
  disabled,
  onPress,
  contentRowStyle,
  titleStyle,
  subtitleStyle,
  pressableContainerStyle,
}: ChatThreadHeaderPressableContentProps) => {
  const { theme } = useTheme()
  const [isPressed, setIsPressed] = useState(false)
  const staticState = useMemo(() => ({
    config: isPressed ? { pressed: 'true' } : {},
  }), [isPressed])
  const resolvedAvatar = useMemo(() => ({
    ...avatar,
  }), [avatar])

  const resolvedContentRowStyle = useMemoizedTheme(theme.components.chat.threadHeader.contentRow, staticState, contentRowStyle)
  const resolvedTitleStyle = useMemoizedTheme(theme.components.chat.threadHeader.title, staticState, titleStyle)
  const resolvedSubtitleStyle = useMemoizedTheme(theme.components.chat.threadHeader.subtitle, staticState, subtitleStyle)

  return (
    <ThemedPressable
      disabled={disabled}
      onPress={onPress}
      coloringStyle="foreground"
      coloringColorVariant="transparent"
      style={pressableContainerStyle}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      <Avatar
        {...resolvedAvatar}
      />
      <View style={resolvedContentRowStyle}>
        {typeof title === 'string' || typeof title === 'number' ? (
          <ThemedText style={resolvedTitleStyle} numberOfLines={1}>{title}</ThemedText>
        ) : (
          title
        )}
        {subtitle != null && (
          typeof subtitle === 'string' || typeof subtitle === 'number' ? (
            <ThemedText style={resolvedSubtitleStyle} numberOfLines={1}>{subtitle}</ThemedText>
          ) : (
            subtitle
          )
        )}
      </View>
    </ThemedPressable>
  )
}

export const ChatThreadHeader = ({
  avatar,
  title,
  subtitle,
  leftActions,
  rightActions,
  onPress,
  disabled,
  style,
  headerStyle,
  contentRowStyle,
  titleStyle,
  subtitleStyle,
  pressableContainerStyle,
  ...props
}: ChatThreadHeaderProps) => {
  const { theme } = useTheme()
  const staticState = useMemo(() => ({}), [])

  const resolvedHeaderStyle = useMemoizedTheme(theme.components.chat.threadHeader.container, staticState, headerStyle)

  return (
    <View {...props} style={[resolvedHeaderStyle, style]}>
      {leftActions != null && (
        <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 0 }}>
          {leftActions}
        </View>
      )}
      <ChatThreadHeaderPressableContent
        avatar={avatar}
        title={title}
        subtitle={subtitle}
        disabled={disabled}
        onPress={onPress}
        contentRowStyle={contentRowStyle}
        titleStyle={titleStyle}
        subtitleStyle={subtitleStyle}
        pressableContainerStyle={pressableContainerStyle}
      />
      {rightActions != null && (
        <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 0 }}>
          {rightActions}
        </View>
      )}
    </View>
  )
}
