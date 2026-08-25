import {
  useMemo,
  useState,
  type ReactNode
} from 'react'
import {
  Pressable,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle
} from 'react-native'

import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'

import { useDebugContext } from '../../global-contexts/debug'
import { useTheme } from '../../global-contexts/theme/ThemeContext'
import { useMemoizedTheme } from '../../hooks/useMemoizedTheme'
import type {
  ListActionItemDescriptionStyle,
  ListActionItemState,
  ListActionItemStyle,
  ListActionItemTitleStyle
} from '../../theme/types/components/listItem'
import type { StyleOverwrite } from '../../theme/types/resolver'
import { createHitBoxOverlayStyle } from '../../utils/hitBoxOverlay'
import { useMinimumTouchTargetHitSlop } from '../../utils/minimumTouchTargetHitSlop'
import { ListItemAccessory } from './ListItemAccessory'
import {
  ListItemTextContent,
  type ListItemContentOrder
} from './ListItemTextContent'

export type ListActionItemProps = Omit<PressableProps, 'children' | 'style'> & {
  title?: string,
  subtitle?: string,
  content?: ReactNode,
  contentOrder?: ListItemContentOrder,
  leading?: ReactNode,
  trailing?: ReactNode,
  color?: ColorPairToken,
  style?: StyleProp<ViewStyle>,
  itemStyle?: StyleOverwrite<ListActionItemState, ListActionItemStyle>,
  titleStyle?: StyleOverwrite<ListActionItemState, ListActionItemTitleStyle>,
  subtitleStyle?: StyleOverwrite<ListActionItemState, ListActionItemDescriptionStyle>,
}

export const ListActionItem = ({
  title,
  subtitle,
  content,
  contentOrder = 'titleFirst',
  leading,
  trailing,
  color,
  disabled,
  style,
  itemStyle,
  titleStyle,
  subtitleStyle,
  hitSlop: providedHitSlop,
  onLayout: providedOnLayout,
  ...props
}: ListActionItemProps) => {
  const { theme } = useTheme()
  const { hitBox } = useDebugContext()
  const { hitSlop, onLayout } = useMinimumTouchTargetHitSlop({
    touchTargetSize: theme.semantics.touchTargetSize({}),
    hitSlop: providedHitSlop,
    onLayout: providedOnLayout,
  })
  const [isPressed, setIsPressed] = useState(false)

  const resolvedState = useMemo((): ListActionItemState => ({
    color,
    isDisabled: !!disabled,
    isPressed,
  }), [color, disabled, isPressed])

  const resolvedItemStyle = useMemoizedTheme(theme.components.listItem.action.container, resolvedState, itemStyle)
  const resolvedLeadingItemContainerStyle = useMemoizedTheme(theme.components.listItem.action.leadingItemContainer, resolvedState)
  const resolvedContentStyle = useMemoizedTheme(theme.components.listItem.action.content, resolvedState)
  const resolvedTrailingItemContainerStyle = useMemoizedTheme(theme.components.listItem.action.trailingItemContainer, resolvedState)
  const resolvedTitleStyle = useMemoizedTheme(theme.components.listItem.action.titleText, resolvedState, titleStyle)
  const resolvedSubtitleStyle = useMemoizedTheme(theme.components.listItem.action.descriptionText, resolvedState, subtitleStyle)
  const resolvedIconStyle = useMemoizedTheme(theme.components.listItem.action.icon, resolvedState)

  return (
    <Pressable
      {...props}
      disabled={disabled}
      hitSlop={hitSlop}
      onLayout={onLayout}
      style={[resolvedItemStyle, style]}
      onPressIn={(event) => {
        setIsPressed(true)
        props.onPressIn?.(event)
      }}
      onPressOut={(event) => {
        setIsPressed(false)
        props.onPressOut?.(event)
      }}
    >
      {hitBox.isVisualizing && (
        <View
          pointerEvents="none"
          style={createHitBoxOverlayStyle(hitSlop, hitBox.color)}
        />
      )}
      {leading != null && (
        <ListItemAccessory
          style={resolvedLeadingItemContainerStyle}
          foreground={color?.onColor}
          iconStyle={resolvedIconStyle}
        >
          {leading}
        </ListItemAccessory>
      )}
      <View style={resolvedContentStyle}>
        <ListItemTextContent
          title={title}
          subtitle={subtitle}
          content={content}
          contentOrder={contentOrder}
          titleStyle={resolvedTitleStyle}
          subtitleStyle={resolvedSubtitleStyle}
        />
      </View>
      {trailing != null && (
        <ListItemAccessory
          style={resolvedTrailingItemContainerStyle}
          foreground={color?.onColor}
          iconStyle={resolvedIconStyle}
        >
          {trailing}
        </ListItemAccessory>
      )}
    </Pressable>
  )
}
