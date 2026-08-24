import {
  useMemo,
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
import type { PressableInteractionState } from '../../utils/pressableInteraction'
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

type ListActionItemContentProps = {
  pressableState: PressableInteractionState,
  title?: string,
  subtitle?: string,
  content?: ReactNode,
  contentOrder: ListItemContentOrder,
  leading?: ReactNode,
  trailing?: ReactNode,
  color?: ColorPairToken,
  disabled?: boolean,
  style?: StyleProp<ViewStyle>,
  itemStyle?: StyleOverwrite<ListActionItemState, ListActionItemStyle>,
  titleStyle?: StyleOverwrite<ListActionItemState, ListActionItemTitleStyle>,
  subtitleStyle?: StyleOverwrite<ListActionItemState, ListActionItemDescriptionStyle>,
  hitSlop: PressableProps['hitSlop'],
}

const ListActionItemContent = ({
  pressableState,
  title,
  subtitle,
  content,
  contentOrder,
  leading,
  trailing,
  color,
  disabled,
  style,
  itemStyle,
  titleStyle,
  subtitleStyle,
  hitSlop,
}: ListActionItemContentProps) => {
  const { theme } = useTheme()
  const { hitBox } = useDebugContext()

  const state = useMemo((): ListActionItemState => ({
    color,
    isDisabled: !!disabled,
    isPressed: pressableState.pressed,
    isHovered: !!pressableState.hovered,
    isFocused: !!pressableState.focused,
    isFocusVisible: !!pressableState.focusVisible,
  }), [
    color,
    disabled,
    pressableState.pressed,
    pressableState.hovered,
    pressableState.focused,
    pressableState.focusVisible,
  ])

  const resolvedItemStyle = useMemoizedTheme(theme.components.listItem.action.container, state, itemStyle)
  const resolvedLeadingItemContainerStyle = useMemoizedTheme(theme.components.listItem.action.leadingItemContainer, state)
  const resolvedContentStyle = useMemoizedTheme(theme.components.listItem.action.content, state)
  const resolvedTrailingItemContainerStyle = useMemoizedTheme(theme.components.listItem.action.trailingItemContainer, state)
  const resolvedTitleStyle = useMemoizedTheme(theme.components.listItem.action.titleText, state, titleStyle)
  const resolvedSubtitleStyle = useMemoizedTheme(theme.components.listItem.action.descriptionText, state, subtitleStyle)
  const resolvedIconStyle = useMemoizedTheme(theme.components.listItem.action.icon, state)

  return (
    <View style={[resolvedItemStyle, style]}>
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
    </View>
  )
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
  const { hitSlop, onLayout } = useMinimumTouchTargetHitSlop({
    touchTargetSize: theme.semantics.touchTargetSize({}),
    hitSlop: providedHitSlop,
    onLayout: providedOnLayout,
  })

  return (
    <Pressable
      {...props}
      disabled={disabled}
      hitSlop={hitSlop}
      onLayout={onLayout}
    >
      {(pressableState) => (
        <ListActionItemContent
          pressableState={pressableState as PressableInteractionState}
          title={title}
          subtitle={subtitle}
          content={content}
          contentOrder={contentOrder}
          leading={leading}
          trailing={trailing}
          color={color}
          disabled={disabled ?? false}
          style={style}
          itemStyle={itemStyle}
          titleStyle={titleStyle}
          subtitleStyle={subtitleStyle}
          hitSlop={hitSlop}
        />
      )}
    </Pressable>
  )
}
