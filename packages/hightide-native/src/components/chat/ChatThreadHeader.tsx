import {
  useMemo,
  type ReactNode
} from 'react'
import {
  Pressable,
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
  PressableState,
  PressableStateLayerStyle
} from '../../theme/types/components/chat'
import type { StyleOverwrite, StyleResolverFunction } from '../../theme/types/resolver'
import type { PressableInteractionState } from '../../utils/pressableInteraction'

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

type ThreadHeaderPressableResolvers = {
  container: StyleResolverFunction<PressableState, PressableContainerStyle>,
  stateLayer: StyleResolverFunction<PressableState, PressableStateLayerStyle>,
}

type PressableInteraction = PressableInteractionState

const toPressableThemeState = (interaction: PressableInteraction): PressableState => ({
  isPressed: interaction.pressed,
  isHovered: !!interaction.hovered,
  isFocused: !!interaction.focused,
  isFocusVisible: !!interaction.focusVisible,
})

type ChatThreadHeaderPressableContentProps = {
  pressableState: PressableInteraction,
  avatar?: AvatarProps,
  title: ReactNode,
  subtitle?: ReactNode,
  disabled?: boolean,
  contentRowStyle?: StyleOverwrite<Record<string, never>, ChatThreadHeaderContentRowStyle>,
  titleStyle?: StyleOverwrite<Record<string, never>, ChatThreadHeaderTitleStyle>,
  subtitleStyle?: StyleOverwrite<Record<string, never>, ChatThreadHeaderSubtitleStyle>,
  pressableContainerStyle?: StyleOverwrite<PressableState, PressableContainerStyle>,
}

const ChatThreadHeaderPressableContent = ({
  pressableState,
  avatar,
  title,
  subtitle,
  contentRowStyle,
  titleStyle,
  subtitleStyle,
  pressableContainerStyle,
}: ChatThreadHeaderPressableContentProps) => {
  const { theme } = useTheme()
  const staticState = useMemo(() => ({}), [])
  const resolvedAvatar = useMemo(() => ({
    ...avatar,
  }), [avatar])

  const pressableThemeState = useMemo(
    () => toPressableThemeState(pressableState),
    [pressableState]
  )
  const pressableResolvers = useMemoizedThemeFactory<
    Record<string, never>,
    ThreadHeaderPressableResolvers
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
    <View style={resolvedContainerStyle}>
      <View pointerEvents="none" style={resolvedStateLayerStyle} />
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
    </View>
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
      <Pressable onPress={onPress} disabled={disabled}>
        {(pressableState) => (
          <ChatThreadHeaderPressableContent
            pressableState={pressableState as PressableInteraction}
            avatar={avatar}
            title={title}
            subtitle={subtitle}
            disabled={disabled}
            contentRowStyle={contentRowStyle}
            titleStyle={titleStyle}
            subtitleStyle={subtitleStyle}
            pressableContainerStyle={pressableContainerStyle}
          />
        )}
      </Pressable>
      {rightActions != null && (
        <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 0 }}>
          {rightActions}
        </View>
      )}
    </View>
  )
}
