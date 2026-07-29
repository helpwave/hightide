import type {
  ImageStyle,
  TextStyle,
  ViewStyle
} from 'react-native'

import type { ComponentTokens } from '@helpwave/hightide-design/components'
import type {
  ElevationShadowTokens,
  TypographyTokens
} from '@helpwave/hightide-design/semantic'
import type { DesignSystemTokens as DesignTokensTheme } from '@helpwave/hightide-design/design-system'

import { resolveColoringStyles } from './colorScheme'
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

const avatarFontWeights: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', 'semibold' | 'bold'> = {
  xs: 'semibold',
  sm: 'semibold',
  md: 'semibold',
  lg: 'bold',
  xl: 'bold',
}

const statusColor = (
  status: AvatarStatus,
  colorSchemes: HightideComponentThemes['colorSchemes'],
  gray: ColorPalette
): string => {
  switch (status) {
  case 'online':
    return colorSchemes.positive.filled.base.background
  case 'busy':
    return colorSchemes.negative.filled.base.background
  case 'away':
    return colorSchemes.warning.filled.base.background
  case 'offline':
  case 'unknown':
  default:
    return gray[500]
  }
}

export type CreateAvatarThemeOptions = {
  semantic: HightideSemanticColors,
  colorSchemes: HightideComponentThemes['colorSchemes'],
  gray: ColorPalette,
  typography: TypographyTokens,
  avatar: ComponentTokens['avatar'],
  icon: ComponentTokens['icon'],
  avatarGroup: ComponentTokens['avatarGroup'],
  shadow: ElevationShadowTokens,
}

export const createAvatarTheme = ({
  semantic,
  colorSchemes,
  gray,
  typography,
  avatar,
  icon,
  avatarGroup,
  shadow,
}: CreateAvatarThemeOptions): AvatarTheme => {
  const resolveAvatar = (state: AvatarState) => {
    const size = state.size ?? 'md'
    const dimension = avatar[size].size
    const resolved = resolveColoringStyles(
      colorSchemes,
      'primary',
      'filled',
      0
    )
    const borderRadius = dimension / 2
    const raisedShadow = shadow.raised

    const avatarStyle: ViewStyle = {
      position: state.isGrouped ? 'absolute' : 'relative',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: dimension,
      height: dimension,
      padding: avatar[size].padding,
      borderRadius,
      backgroundColor: resolved.backgroundColor,
      overflow: 'hidden',
      ...(state.isGrouped ? {
        left: (state.groupIndex ?? 0) * dimension * avatarGroup.overlap,
        zIndex: avatarGroup.maxShown - (state.groupIndex ?? 0),
        shadowColor: raisedShadow.color,
        shadowOffset: { width: raisedShadow.x, height: raisedShadow.y },
        shadowOpacity: 1,
        shadowRadius: raisedShadow.blur,
        elevation: raisedShadow.blur,
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
      fontSize: avatar[size].fontSize,
      fontWeight: typography.fontWeights[avatarFontWeights[size]] as TextStyle['fontWeight'],
      textAlign: 'center',
    }

    const iconStyle: AvatarIconStyle = {
      size: icon[size].size,
      strokeWidth: icon[size].strokeWidth,
      color: resolved.color,
    }

    return {
      avatar: avatarStyle,
      image,
      text,
      icon: iconStyle,
    }
  }

  const resolveWithStatus = (state: AvatarWithStatusState) => {
    const size = state.size ?? 'md'
    const status = state.status ?? 'unknown'
    const statusDotSize = avatar[size].statusDotSize

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
      borderWidth: avatar[size].statusDotBorderWidth,
      borderColor: semantic.background,
      backgroundColor: statusColor(status, colorSchemes, gray),
    }

    return { container, statusDot }
  }

  const resolveWithLabel = (_state: AvatarWithLabelState) => {
    const bodyMedium = typography.scales.body.medium

    const container: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      gap: avatarGroup.gap,
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
    const dimension = avatar[size].size
    const visibleCount = Math.min(state.count ?? avatarGroup.maxShown, avatarGroup.maxShown)
    const stackWidth = dimension * (avatarGroup.overlap * Math.max(visibleCount - 1, 0) + 1)

    const container: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      gap: avatarGroup.gap,
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

export const createAvatarThemeFromDesign = (
  theme: DesignTokensTheme,
  colors: { gray: ColorPalette }
): AvatarTheme => {
  return createAvatarTheme({
    semantic: theme.semantic.colors,
    colorSchemes: theme.semantic.colorSchemes as HightideComponentThemes['colorSchemes'],
    gray: colors.gray,
    typography: theme.semantic.typography,
    avatar: theme.components.avatar,
    icon: theme.components.icon,
    avatarGroup: theme.components.avatarGroup,
    shadow: theme.semantic.shadow,
  })
}
