import type {
  ImageStyle,
  TextStyle,
  ViewStyle
} from 'react-native'

import {
  hightideBorder,
  hightideElements,
  hightideShadow,
  hightideSpacing,
  hightideTypography,
  type ElementSize
} from '@helpwave/hightide-design/primitive'
import type { TypographyTokens } from '@helpwave/hightide-design/semantic'
import type { HightideThemeTokens as DesignTokensTheme } from '@helpwave/hightide-design/theme'

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

const avatarGroupMaxShown = 5
const avatarGroupOverlap = 0.5

const avatarSize = (size: ElementSize): number => hightideElements[size].size - hightideSpacing.xs

const avatarPadding = (size: ElementSize): number => Math.max(Math.round(hightideElements[size].inset / 2), 2)

const avatarFontSize = (size: ElementSize): number => {
  switch (size) {
  case 'xs':
  case 'sm':
    return Number(hightideTypography.fontSize.xs)
  case 'md':
    return Number(hightideTypography.fontSize.lg)
  case 'lg':
  case 'xl':
    return Number(hightideTypography.fontSize['2xl'])
  }
}

const avatarFontWeights: Record<ElementSize, number> = {
  xs: hightideTypography.fontWeight.semibold,
  sm: hightideTypography.fontWeight.semibold,
  md: hightideTypography.fontWeight.semibold,
  lg: hightideTypography.fontWeight.bold,
  xl: hightideTypography.fontWeight.bold,
}

const iconSizeFor = (size: ElementSize): number => {
  switch (size) {
  case 'xs':
    return hightideSpacing.md
  case 'sm':
    return hightideSpacing.md + hightideSpacing.xs / 2
  case 'md':
    return hightideSpacing.lg
  case 'lg':
    return hightideSpacing.xl - hightideSpacing.xs
  case 'xl':
    return hightideSpacing.xl
  }
}

const statusDotSizeFor = (size: ElementSize): number => Math.round(avatarSize(size) / 2)

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
    const dimension = avatarSize(size)
    const resolved = resolveColoringStyles(coloring.primary, 'solid', semantic)
    const borderRadius = dimension / 2
    const shadow = hightideShadow.avatar

    const avatar: ViewStyle = {
      position: state.isGrouped ? 'absolute' : 'relative',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: dimension,
      height: dimension,
      padding: avatarPadding(size),
      borderRadius,
      backgroundColor: resolved.backgroundColor,
      overflow: 'hidden',
      ...(state.isGrouped ? {
        left: (state.groupIndex ?? 0) * dimension * avatarGroupOverlap,
        zIndex: avatarGroupMaxShown - (state.groupIndex ?? 0),
        shadowColor: '#000000',
        shadowOffset: { width: shadow.x, height: shadow.y },
        shadowOpacity: 0.2,
        shadowRadius: shadow.blur,
        elevation: shadow.blur,
      } : {}),
    }

    const image: ImageStyle = {
      position: 'absolute',
      left: 0,
      top: 0,
      width: dimension,
      height: dimension,
      borderRadius,
    }

    const text: TextStyle = {
      color: resolved.color,
      fontSize: avatarFontSize(size),
      fontWeight: avatarFontWeights[size] as TextStyle['fontWeight'],
      textAlign: 'center',
    }

    const icon: AvatarIconStyle = {
      size: iconSizeFor(size),
      strokeWidth: hightideBorder.base,
      color: resolved.color,
    }

    return { avatar, image, text, icon }
  }

  const resolveWithStatus = (state: AvatarWithStatusState) => {
    const size = state.size ?? 'md'
    const status = state.status ?? 'unknown'
    const statusDotSize = statusDotSizeFor(size)

    const container: ViewStyle = {
      position: 'relative',
      alignSelf: 'flex-start',
    }

    const statusDot: ViewStyle = {
      position: 'absolute',
      right: 0,
      bottom: 0,
      zIndex: 1,
      width: statusDotSize,
      height: statusDotSize,
      borderRadius: statusDotSize / 2,
      borderWidth: size === 'xs' ? hightideBorder.thin + 0.5 : hightideBorder.base,
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
      gap: hightideSpacing.sm,
    }

    const text: TextStyle = {
      fontSize: Number(bodyMedium.fontSize),
      fontWeight: bodyMedium.fontWeight as TextStyle['fontWeight'],
      lineHeight: typeof bodyMedium.lineHeight === 'number'
        ? bodyMedium.lineHeight
        : Number(bodyMedium.lineHeight),
      color: semantic.onBackground,
      flexShrink: 1,
    }

    return { container, text }
  }

  const resolveGroup = (state: AvatarGroupState) => {
    const size = state.size ?? 'md'
    const dimension = avatarSize(size)
    const visibleCount = Math.min(state.count ?? avatarGroupMaxShown, avatarGroupMaxShown)
    const stackWidth = dimension * (avatarGroupOverlap * Math.max(visibleCount - 1, 0) + 1)

    const container: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      gap: hightideSpacing.sm,
      height: dimension,
      alignSelf: 'flex-start',
    }

    const stack: ViewStyle = {
      position: 'relative',
      width: stackWidth,
      height: dimension,
    }

    const more: TextStyle = {
      fontSize: (dimension * 2) / 3,
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

export { avatarGroupMaxShown }
