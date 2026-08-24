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

import { HightideIconRegistry } from '../../icons/HightideIconRegistry'
import { ThemedIcon } from '../visualization-and-display/ThemedIcon'
import { useDebugContext } from '../../global-contexts/debug'
import { useTheme } from '../../global-contexts/theme/ThemeContext'
import { useMemoizedTheme } from '../../hooks/useMemoizedTheme'
import type {
  ListNavigationItemDescriptionStyle,
  ListNavigationItemState,
  ListNavigationItemStyle,
  ListNavigationItemTitleStyle
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

export type ListNavigationItemProps = Omit<PressableProps, 'children' | 'style'> & {
  title?: string,
  subtitle?: string,
  content?: ReactNode,
  contentOrder?: ListItemContentOrder,
  leading?: ReactNode,
  color?: ColorPairToken,
  style?: StyleProp<ViewStyle>,
  itemStyle?: StyleOverwrite<ListNavigationItemState, ListNavigationItemStyle>,
  titleStyle?: StyleOverwrite<ListNavigationItemState, ListNavigationItemTitleStyle>,
  subtitleStyle?: StyleOverwrite<ListNavigationItemState, ListNavigationItemDescriptionStyle>,
}

type ListNavigationItemContentProps = {
  pressableState: PressableInteractionState,
  title?: string,
  subtitle?: string,
  content?: ReactNode,
  contentOrder: ListItemContentOrder,
  leading?: ReactNode,
  color?: ColorPairToken,
  disabled?: boolean,
  style?: StyleProp<ViewStyle>,
  itemStyle?: StyleOverwrite<ListNavigationItemState, ListNavigationItemStyle>,
  titleStyle?: StyleOverwrite<ListNavigationItemState, ListNavigationItemTitleStyle>,
  subtitleStyle?: StyleOverwrite<ListNavigationItemState, ListNavigationItemDescriptionStyle>,
  hitSlop: PressableProps['hitSlop'],
}

const ListNavigationItemContent = ({
  pressableState,
  title,
  subtitle,
  content,
  contentOrder,
  leading,
  color,
  disabled,
  style,
  itemStyle,
  titleStyle,
  subtitleStyle,
  hitSlop,
}: ListNavigationItemContentProps) => {
  const { theme } = useTheme()
  const { hitBox } = useDebugContext()

  const state = useMemo((): ListNavigationItemState => ({
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

  const resolvedItemStyle = useMemoizedTheme(theme.components.listItem.navigation.container, state, itemStyle)
  const resolvedLeadingItemContainerStyle = useMemoizedTheme(theme.components.listItem.navigation.leadingItemContainer, state)
  const resolvedContentStyle = useMemoizedTheme(theme.components.listItem.navigation.content, state)
  const resolvedTrailingItemContainerStyle = useMemoizedTheme(theme.components.listItem.navigation.trailingItemContainer, state)
  const resolvedTitleStyle = useMemoizedTheme(theme.components.listItem.navigation.titleText, state, titleStyle)
  const resolvedSubtitleStyle = useMemoizedTheme(theme.components.listItem.navigation.descriptionText, state, subtitleStyle)
  const resolvedIconStyle = useMemoizedTheme(theme.components.listItem.navigation.icon, state)

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
      <ListItemAccessory
        style={resolvedTrailingItemContainerStyle}
        foreground={color?.onColor}
        iconStyle={resolvedIconStyle}
      >
        <ThemedIcon icon={HightideIconRegistry.ChevronRight} />
      </ListItemAccessory>
    </View>
  )
}

export const ListNavigationItem = ({
  title,
  subtitle,
  content,
  contentOrder = 'titleFirst',
  leading,
  color,
  disabled,
  style,
  itemStyle,
  titleStyle,
  subtitleStyle,
  hitSlop: providedHitSlop,
  onLayout: providedOnLayout,
  ...props
}: ListNavigationItemProps) => {
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
        <ListNavigationItemContent
          pressableState={pressableState as PressableInteractionState}
          title={title}
          subtitle={subtitle}
          content={content}
          contentOrder={contentOrder}
          leading={leading}
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
