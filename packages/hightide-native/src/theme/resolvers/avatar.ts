import type {
  ImageStyle,
  TextStyle,
  ViewStyle
} from 'react-native'

import {
  componentLayouts,
  fontWeights
} from '@helpwave/hightide-design/tokens'
import type {
  ElementSize,
  HightideThemeTokens as DesignTokensTheme,
  TypographyTokens
} from '@helpwave/hightide-design/types'

import { resolveColoringStyles } from './coloring'
import type {
  ColorPalette,
  HightideSemanticColors
} from '../types/color'
import type {
  AvatarGroupState,
  AvatarIconStyle,
  AvatarState,
  AvatarStatus,
  AvatarTheme,
  AvatarWithLabelState,
  AvatarWithStatusState
} from '../types/components/avatar'
import type { HightideComponentThemes } from '../types/components/hightide'
import { createStyleResolver } from '../types/resolver'

const avatarFontWeights: Record<ElementSize, string> = {
  xs: fontWeights.semibold,
  sm: fontWeights.semibold,
  md: fontWeights.semibold,
  lg: fontWeights.bold,
}

const statusColor = (
  status: AvatarStatus,
  semantic: HightideSemanticColors,
  gray: ColorPalette
): string => {
  switch (status) {
  case 'online':
    return semantic.positive
  case 'busy':
    return semantic.negative
  case 'away':
    return semantic.warning
  case 'offline':
  case 'unknown':
  default:
    return gray[500]
  }
}

export type CreateAvatarThemeOptions = {
  semantic: HightideSemanticColors,
  coloring: HightideComponentThemes['coloring'],
  gray: ColorPalette,
  typography: TypographyTokens,
}

export const createAvatarTheme = ({
  semantic,
  coloring,
  gray,
  typography,
}: CreateAvatarThemeOptions): AvatarTheme => {
  const resolveAvatar = (state: AvatarState) => {
    const size = state.size ?? 'md'
    const layout = componentLayouts.avatar[size]
    const groupLayout = componentLayouts.avatarGroup
    const resolved = resolveColoringStyles(coloring.primary, 'solid', semantic)
    const borderRadius = layout.size / 2

    const avatar: ViewStyle = {
      position: state.isGrouped ? 'absolute' : 'relative',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: layout.size,
      height: layout.size,
      padding: layout.padding,
      borderRadius,
      backgroundColor: resolved.backgroundColor,
      overflow: 'hidden',
      ...(state.isGrouped ? {
        left: (state.groupIndex ?? 0) * layout.size * groupLayout.overlap,
        zIndex: groupLayout.maxShown - (state.groupIndex ?? 0),
        shadowColor: '#000000',
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
      } : {}),
    }

    const image: ImageStyle = {
      position: 'absolute',
      left: 0,
      top: 0,
      width: layout.size,
      height: layout.size,
      borderRadius,
    }

    const text: TextStyle = {
      color: resolved.color,
      fontSize: layout.fontSize,
      fontWeight: avatarFontWeights[size] as TextStyle['fontWeight'],
      textAlign: 'center',
    }

    const icon: AvatarIconStyle = {
      size: componentLayouts.icon[size].size,
      strokeWidth: componentLayouts.icon[size].strokeWidth,
      color: resolved.color,
    }

    return { avatar, image, text, icon }
  }

  const resolveWithStatus = (state: AvatarWithStatusState) => {
    const size = state.size ?? 'md'
    const status = state.status ?? 'unknown'
    const layout = componentLayouts.avatar[size]

    const container: ViewStyle = {
      position: 'relative',
      alignSelf: 'flex-start',
    }

    const statusDot: ViewStyle = {
      position: 'absolute',
      right: 0,
      bottom: 0,
      zIndex: 1,
      width: layout.statusDotSize,
      height: layout.statusDotSize,
      borderRadius: layout.statusDotSize / 2,
      borderWidth: layout.statusDotBorderWidth,
      borderColor: semantic.background,
      backgroundColor: statusColor(status, semantic, gray),
    }

    return { container, statusDot }
  }

  const resolveWithLabel = (_state: AvatarWithLabelState) => {
    const bodyMedium = typography.scales.body.medium

    const container: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      gap: componentLayouts.avatarGroup.gap,
    }

    const text: TextStyle = {
      fontSize: bodyMedium.fontSize,
      fontWeight: bodyMedium.fontWeight as TextStyle['fontWeight'],
      lineHeight: bodyMedium.lineHeight,
      color: semantic.onBackground,
      flexShrink: 1,
    }

    return { container, text }
  }

  const resolveGroup = (state: AvatarGroupState) => {
    const size = state.size ?? 'md'
    const layout = componentLayouts.avatar[size]
    const groupLayout = componentLayouts.avatarGroup
    const visibleCount = Math.min(state.count ?? groupLayout.maxShown, groupLayout.maxShown)
    const stackWidth = layout.size * (groupLayout.overlap * Math.max(visibleCount - 1, 0) + 1)

    const container: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      gap: groupLayout.gap,
      height: layout.size,
      alignSelf: 'flex-start',
    }

    const stack: ViewStyle = {
      position: 'relative',
      width: stackWidth,
      height: layout.size,
    }

    const more: TextStyle = {
      fontSize: (layout.size * 2) / 3,
      color: semantic.onBackground,
      flexShrink: 1,
    }

    return { container, stack, more }
  }

  return {
    avatar: createStyleResolver((state) => resolveAvatar(state).avatar),
    image: createStyleResolver((state) => resolveAvatar(state).image),
    text: createStyleResolver((state) => resolveAvatar(state).text),
    icon: createStyleResolver((state) => resolveAvatar(state).icon),
    withStatus: {
      container: createStyleResolver((state) => resolveWithStatus(state).container),
      statusDot: createStyleResolver((state) => resolveWithStatus(state).statusDot),
    },
    withLabel: {
      container: createStyleResolver((state) => resolveWithLabel(state).container),
      text: createStyleResolver((state) => resolveWithLabel(state).text),
    },
    group: {
      container: createStyleResolver((state) => resolveGroup(state).container),
      stack: createStyleResolver((state) => resolveGroup(state).stack),
      more: createStyleResolver((state) => resolveGroup(state).more),
    },
  }
}

export const createAvatarThemeFromDesign = (theme: DesignTokensTheme): AvatarTheme => {
  return createAvatarTheme({
    semantic: theme.semanticColors,
    coloring: theme.coloring as HightideComponentThemes['coloring'],
    gray: theme.colors.gray.value as ColorPalette,
    typography: theme.typography,
  })
}
