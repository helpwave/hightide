import {
  useMemo,
  useState,
  type ReactNode
} from 'react'
import {
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewProps,
  type ViewStyle
} from 'react-native'

import { useTheme } from '../../global-contexts/theme/ThemeContext'
import { useMemoizedTheme, useMemoizedThemeFactory } from '../../hooks/useMemoizedTheme'
import { ThemedText } from '../visualization-and-display/ThemedText'
import {
  Avatar,
  type AvatarProps
} from '../visualization-and-display/Avatar'
import type {
  AvatarState,
  AvatarThemeResolvers
} from '../../theme/types/components/avatar'
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
import type { ThemedPressableState, ThemedPressableThemeResolvers } from '../../theme'

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
  const staticState = useMemo(() => ({}), [])
  const resolvedAvatar = useMemo(() => ({
    ...avatar,
  }), [avatar])

  const pressableThemeState = useMemo((): PressableState => ({
    isPressed,
    isDisabled: !!disabled,
  }), [disabled, isPressed])
  const pressableResolvers = useMemoizedThemeFactory<
    ThemedPressableState,
    ThemedPressableThemeResolvers
  >(theme.components.chat.threadHeader.pressable, staticState)
  const resolvedContentRowStyle = useMemoizedTheme(theme.components.chat.threadHeader.contentRow, staticState, contentRowStyle)
  const resolvedTitleStyle = useMemoizedTheme(theme.components.chat.threadHeader.title, staticState, titleStyle)
  const resolvedSubtitleStyle = useMemoizedTheme(theme.components.chat.threadHeader.subtitle, staticState, subtitleStyle)
  const resolvedContainerStyle = useMemoizedTheme(pressableResolvers.container, pressableThemeState, pressableContainerStyle)
  const resolvedStateLayerStyle = useMemoizedTheme(pressableResolvers.stateLayer, pressableThemeState)

  const avatarTheme = useMemoizedThemeFactory<AvatarState, AvatarThemeResolvers>(
    theme.components.chat.threadHeader.avatar,
    {
      size: resolvedAvatar.size,
      color: resolvedAvatar.color,
    }
  )
  const avatarSize = useMemo(() => {
    if (typeof resolvedAvatar.size === 'number' || typeof resolvedAvatar.size === 'string') {
      return resolvedAvatar.size
    }

    const width = StyleSheet.flatten(avatarTheme.container({})).width
    return typeof width === 'number' ? width : resolvedAvatar.size
  }, [avatarTheme, resolvedAvatar.size])

  return (
    <ThemedPressable
      disabled={disabled}
      onPress={onPress}
      style={resolvedContainerStyle}
      stateLayerStyle={resolvedStateLayerStyle}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      <Avatar
        {...resolvedAvatar}
        size={avatarSize}
        avatarStyle={(avatarState) => avatarTheme.container(
          {
            ...avatarState,
            size: avatarSize,
          },
          resolvedAvatar.avatarStyle
        )}
        imageStyle={(avatarState) => avatarTheme.image(
          {
            ...avatarState,
            size: avatarSize,
          },
          resolvedAvatar.imageStyle
        )}
        textStyle={(avatarState) => avatarTheme.text(
          {
            ...avatarState,
            size: avatarSize,
          },
          resolvedAvatar.textStyle
        )}
        iconStyle={(avatarState) => avatarTheme.icon(
          {
            ...avatarState,
            size: avatarSize,
          },
          resolvedAvatar.iconStyle
        )}
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
