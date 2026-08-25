import {
  useMemo,
  useState,
  type ReactNode
} from 'react'
import {
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
import { ThemedPressable } from '../user-interaction'

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

export const ChatQuickReplyChip = ({
  isActive = false,
  children,
  disabled,
  style,
  textStyle,
  ...props
}: ChatQuickReplyChipProps) => {
  const { theme } = useTheme()
  const [isPressed, setIsPressed] = useState(false)
  const state = useMemo((): ChatQuickReplyChipState => ({ isActive }), [isActive])
  const pressableThemeState = useMemo((): PressableState => ({
    isPressed,
    isDisabled: !!disabled,
  }), [disabled, isPressed])
  const pressableResolvers = useMemoizedThemeFactory<
    ChatQuickReplyChipState,
    QuickReplyChipPressableResolvers
  >(theme.components.chat.quickReplyChip.pressable, state)

  const resolvedContainerStyle = useMemoizedTheme(pressableResolvers.container, pressableThemeState, style)
  const resolvedStateLayerStyle = useMemoizedTheme(pressableResolvers.stateLayer, pressableThemeState)
  const resolvedTextStyle = useMemoizedTheme(pressableResolvers.text, pressableThemeState, textStyle)

  return (
    <ThemedPressable
      {...props}
      disabled={disabled}
      style={resolvedContainerStyle}
      onPressIn={(event) => {
        setIsPressed(true)
        props.onPressIn?.(event)
      }}
      onPressOut={(event) => {
        setIsPressed(false)
        props.onPressOut?.(event)
      }}
    >
      <View pointerEvents="none" style={resolvedStateLayerStyle} />
      {typeof children === 'string' || typeof children === 'number' ? (
        <ThemedText style={resolvedTextStyle}>{children}</ThemedText>
      ) : (
        children
      )}
    </ThemedPressable>
  )
}
