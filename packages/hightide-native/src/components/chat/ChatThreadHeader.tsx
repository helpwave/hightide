import {
  useMemo,
  type ReactNode
} from 'react'
import {
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle
} from 'react-native'

import { useTheme } from '../../global-contexts/theme/ThemeContext'
import { ThemedText } from '../visualization-and-display/ThemedText'
import {
  Avatar,
  type AvatarProps
} from '../visualization-and-display/Avatar'
import type {
  ChatThreadHeaderContentRowStyle,
  ChatThreadHeaderStyle,
  ChatThreadHeaderSubtitleStyle,
  ChatThreadHeaderTitleStyle
} from '../../theme/types/components/chat'
import type { StyleOverwrite } from '../../theme/types/resolver'

export type ChatThreadHeaderProps = Omit<ViewProps, 'style'> & {
  avatar?: AvatarProps,
  title: ReactNode,
  subtitle?: ReactNode,
  leftActions?: ReactNode,
  rightActions?: ReactNode,
  style?: StyleProp<ViewStyle>,
  headerStyle?: StyleOverwrite<Record<string, never>, ChatThreadHeaderStyle>,
  contentRowStyle?: StyleOverwrite<Record<string, never>, ChatThreadHeaderContentRowStyle>,
  titleStyle?: StyleOverwrite<Record<string, never>, ChatThreadHeaderTitleStyle>,
  subtitleStyle?: StyleOverwrite<Record<string, never>, ChatThreadHeaderSubtitleStyle>,
}

export const ChatThreadHeader = ({
  avatar,
  title,
  subtitle,
  leftActions,
  rightActions,
  style,
  headerStyle,
  contentRowStyle,
  titleStyle,
  subtitleStyle,
  ...props
}: ChatThreadHeaderProps) => {
  const { theme } = useTheme()
  const state = useMemo(() => ({}), [])
  const resolvedAvatar = useMemo(() => ({
    ...avatar,
  }), [avatar])

  const resolvedHeaderStyle = useMemo(
    () => theme.components.chat.threadHeader.container(state, headerStyle),
    [theme, state, headerStyle]
  )
  const resolvedContentRowStyle = useMemo(
    () => theme.components.chat.threadHeader.contentRow(state, contentRowStyle),
    [theme, state, contentRowStyle]
  )
  const resolvedTitleStyle = useMemo(
    () => theme.components.chat.threadHeader.title(state, titleStyle),
    [theme, state, titleStyle]
  )
  const resolvedSubtitleStyle = useMemo(
    () => theme.components.chat.threadHeader.subtitle(state, subtitleStyle),
    [theme, state, subtitleStyle]
  )

  const avatarThemeState = useMemo(() => ({
    size: resolvedAvatar.size,
    color: resolvedAvatar.color,
  }), [resolvedAvatar.size, resolvedAvatar.color])

  const avatarTheme = useMemo(
    () => theme.components.chat.threadHeader.avatar(avatarThemeState),
    [theme, avatarThemeState]
  )

  return (
    <View {...props} style={[resolvedHeaderStyle, style]}>
      {leftActions != null && (
        <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 0 }}>
          {leftActions}
        </View>
      )}
      <Avatar
        {...resolvedAvatar}
        avatarStyle={(_, avatarState) => avatarTheme.container(
          {
            ...avatarState,
            size: resolvedAvatar.size,
          },
          resolvedAvatar.avatarStyle
        )}
        imageStyle={(_, avatarState) => avatarTheme.image(
          {
            ...avatarState,
            size: resolvedAvatar.size,
          },
          resolvedAvatar.imageStyle
        )}
        textStyle={(_, avatarState) => avatarTheme.text(
          {
            ...avatarState,
            size: resolvedAvatar.size,
          },
          resolvedAvatar.textStyle
        )}
        iconStyle={(_, avatarState) => avatarTheme.icon(
          {
            ...avatarState,
            size: resolvedAvatar.size,
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
      {rightActions != null && (
        <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 0 }}>
          {rightActions}
        </View>
      )}
    </View>
  )
}
