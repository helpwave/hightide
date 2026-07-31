import type {
  ImageStyle,
  TextStyle,
  ViewStyle
} from 'react-native'

import type { HightideComponentTokens } from '@helpwave/hightide-design/component-tokens'
import type {
  HightideColorSchemes,
  HightideElevationShadowTokens,
  HightideSemanticColorTokens,
  HightideTypographyTokens
} from '@helpwave/hightide-design/semantic-tokens'
import type { HightideDesignSystemTokens as DesignTokensTheme } from '@helpwave/hightide-design/design-system'

import type {
  AvatarGroupState,
  AvatarIconStyle,
  AvatarState,
  AvatarStatus,
  AvatarTheme,
  AvatarWithLabelState,
  AvatarWithStatusState
} from '../types/components/avatar'
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
  colorSchemes: HightideColorSchemes,
  semanticColors: HightideSemanticColorTokens
): string => {
  switch (status) {
  case 'online':
    return colorSchemes.positive.filled.base.color
  case 'busy':
    return colorSchemes.negative.filled.base.color
  case 'away':
    return colorSchemes.warning.filled.base.color
  case 'offline':
  case 'unknown':
  default:
    return semanticColors.disabled
  }
}

export type CreateAvatarThemeOptions = {
  colors: HightideSemanticColorTokens,
  colorSchemes: HightideColorSchemes,
  typography: HightideTypographyTokens,
  avatar: HightideComponentTokens['avatar'],
  icon: HightideComponentTokens['icon'],
  avatarGroup: HightideComponentTokens['avatarGroup'],
  shadow: HightideElevationShadowTokens,
}

export const createAvatarTheme = ({
  colors,
  colorSchemes,
  typography,
  avatar,
  icon,
  avatarGroup,
  shadow,
}: CreateAvatarThemeOptions): AvatarTheme => {
  const resolveAvatar = (state: AvatarState) => {
    const size = state.size ?? 'md'
    const dimension = avatar[size].size
    const primaryFilled = colorSchemes.primary.filled.base
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
      backgroundColor: primaryFilled.color,
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
      color: primaryFilled.foreground,
      fontSize: avatar[size].fontSize,
      fontWeight: typography.fontWeights[avatarFontWeights[size]] as TextStyle['fontWeight'],
      textAlign: 'center',
    }

    const iconStyle: AvatarIconStyle = {
      size: icon[size].size,
      strokeWidth: icon[size].strokeWidth,
      color: primaryFilled.foreground,
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
      borderColor: colors.background,
      backgroundColor: statusColor(status, colorSchemes, colors),
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
      color: colors.onBackground,
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
      color: colors.onBackground,
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
  theme: DesignTokensTheme
): AvatarTheme => {
  return createAvatarTheme({
    colors: theme.colors,
    colorSchemes: theme.colorSchemes as HightideColorSchemes,
    typography: theme.typography,
    avatar: theme.components.avatar,
    icon: theme.components.icon,
    avatarGroup: theme.components.avatarGroup,
    shadow: theme.shadow,
  })
}
