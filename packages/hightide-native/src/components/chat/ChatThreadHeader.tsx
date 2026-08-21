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
import {
  ThemedPressable,
  type ThemedPressableProps
} from '../user-interaction/ThemedPressable'
import type {
  ChatThreadHeaderContentRowStyle,
  ChatThreadHeaderStyle,
  ChatThreadHeaderSubtitleStyle,
  ChatThreadHeaderTitleStyle,
  PressableContainerStyle,
  PressableState
} from '../../theme/types/components/chat'
import type { StyleOverwrite } from '../../theme/types/resolver'

export type ChatThreadHeaderProps = Omit<ViewProps, 'style'> & {
  avatar?: AvatarProps,
  title: ReactNode,
  subtitle?: ReactNode,
  leftActions?: ReactNode,
  rightActions?: ReactNode,
  onPress?: ThemedPressableProps['onPress'],
  disabled?: boolean,
  style?: StyleProp<ViewStyle>,
  headerStyle?: StyleOverwrite<Record<string, never>, ChatThreadHeaderStyle>,
  contentRowStyle?: StyleOverwrite<Record<string, never>, ChatThreadHeaderContentRowStyle>,
  titleStyle?: StyleOverwrite<Record<string, never>, ChatThreadHeaderTitleStyle>,
  subtitleStyle?: StyleOverwrite<Record<string, never>, ChatThreadHeaderSubtitleStyle>,
  pressableContainerStyle?: StyleOverwrite<PressableState, PressableContainerStyle>,
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
  const pressableResolvers = useMemo(
    () => theme.components.chat.threadHeader.pressable(state),
    [theme, state]
  )

  const avatarTheme = useMemo(
    () => theme.components.chat.threadHeader.avatar({
      size: resolvedAvatar.size,
      color: resolvedAvatar.color,
    }),
    [theme, resolvedAvatar.size, resolvedAvatar.color]
  )
  const avatarSize = useMemo(() => {
    if (typeof resolvedAvatar.size === 'number' || typeof resolvedAvatar.size === 'string') {
      return resolvedAvatar.size
    }

    const width = avatarTheme.container({}).width
    return typeof width === 'number' ? width : resolvedAvatar.size
  }, [avatarTheme, resolvedAvatar.size])

  return (
    <View {...props} style={[resolvedHeaderStyle, style]}>
      {leftActions != null && (
        <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 0 }}>
          {leftActions}
        </View>
      )}
      <ThemedPressable
        onPress={onPress}
        disabled={disabled}
        style={(pressableState) => (
          pressableResolvers.container(pressableState, pressableContainerStyle)
        )}
        stateLayerStyle={(pressableState) => (
          pressableResolvers.stateLayer(pressableState)
        )}
        textStyle={(pressableState) => (
          pressableResolvers.text(pressableState)
        )}
        iconStyle={(pressableState) => (
          pressableResolvers.icon(pressableState)
        )}
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
      {rightActions != null && (
        <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 0 }}>
          {rightActions}
        </View>
      )}
    </View>
  )
}
