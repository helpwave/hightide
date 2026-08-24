import {
  useMemo,
  type ReactNode
} from 'react'
import {
  Pressable,
  View,
  type PressableProps
} from 'react-native'

import { useTheme } from '../../global-contexts/theme/ThemeContext'
import { useMemoizedTheme, useMemoizedThemeFactory } from '../../hooks/useMemoizedTheme'
import { ThemedText } from '../visualization-and-display/ThemedText'
import type {
  ChatQuickReplyChipState,
  PressableContainerStyle,
  PressableIconStyle,
  PressableState,
  PressableStateLayerStyle,
  PressableTextStyle
} from '../../theme/types/components/chat'
import type { StyleOverwrite, StyleResolverFunction } from '../../theme/types/resolver'
import type { PressableInteractionState } from '../../utils/pressableInteraction'

export type ChatQuickReplyChipProps = Omit<PressableProps, 'children' | 'style'> & {
  isActive?: boolean,
  children?: ReactNode,
  style?: StyleOverwrite<PressableState, PressableContainerStyle>,
  textStyle?: StyleOverwrite<PressableState, PressableTextStyle>,
  iconStyle?: StyleOverwrite<PressableState, PressableIconStyle>,
}

type QuickReplyChipPressableResolvers = {
  container: StyleResolverFunction<PressableState, PressableContainerStyle>,
  stateLayer: StyleResolverFunction<PressableState, PressableStateLayerStyle>,
  text: StyleResolverFunction<PressableState, PressableTextStyle>,
  icon: StyleResolverFunction<PressableState, PressableIconStyle>,
}

type PressableInteraction = PressableInteractionState

const toPressableThemeState = (interaction: PressableInteraction): PressableState => ({
  isPressed: interaction.pressed,
  isHovered: !!interaction.hovered,
  isFocused: !!interaction.focused,
  isFocusVisible: !!interaction.focusVisible,
})

type ChatQuickReplyChipContentProps = {
  pressableState: PressableInteraction,
  isActive: boolean,
  children?: ReactNode,
  style?: StyleOverwrite<PressableState, PressableContainerStyle>,
  textStyle?: StyleOverwrite<PressableState, PressableTextStyle>,
  iconStyle?: StyleOverwrite<PressableState, PressableIconStyle>,
}

const ChatQuickReplyChipContent = ({
  pressableState,
  isActive,
  children,
  style,
  textStyle,
}: ChatQuickReplyChipContentProps) => {
  const { theme } = useTheme()
  const state = useMemo((): ChatQuickReplyChipState => ({ isActive }), [isActive])
  const pressableThemeState = useMemo(
    () => toPressableThemeState(pressableState),
    [pressableState]
  )
  const pressableResolvers = useMemoizedThemeFactory<
    ChatQuickReplyChipState,
    QuickReplyChipPressableResolvers
  >(theme.components.chat.quickReplyChip.pressable, state)

  const resolvedContainerStyle = useMemoizedTheme(pressableResolvers.container, pressableThemeState, style)
  const resolvedStateLayerStyle = useMemoizedTheme(pressableResolvers.stateLayer, pressableThemeState)
  const resolvedTextStyle = useMemoizedTheme(pressableResolvers.text, pressableThemeState, textStyle)

  return (
    <View style={resolvedContainerStyle}>
      <View pointerEvents="none" style={resolvedStateLayerStyle} />
      {typeof children === 'string' || typeof children === 'number' ? (
        <ThemedText style={resolvedTextStyle}>{children}</ThemedText>
      ) : (
        children
      )}
    </View>
  )
}

export const ChatQuickReplyChip = ({
  isActive = false,
  children,
  disabled,
  style,
  textStyle,
  iconStyle,
  ...props
}: ChatQuickReplyChipProps) => {
  return (
    <Pressable {...props} disabled={disabled}>
      {(pressableState) => (
        <ChatQuickReplyChipContent
          pressableState={pressableState as PressableInteraction}
          isActive={isActive}
          style={style}
          textStyle={textStyle}
          iconStyle={iconStyle}
        >
          {children}
        </ChatQuickReplyChipContent>
      )}
    </Pressable>
  )
}
