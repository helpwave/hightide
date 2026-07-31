import type {
  ImageStyle,
  TextStyle
} from 'react-native'

import type { HightideDesignSystemTokens } from '@helpwave/hightide-design/design-system'
import type {
  HightideSematicColorSchemeTokens,
  HightideSemanticColorTokens
} from '@helpwave/hightide-design/semantic-tokens'

import type {
  AvatarGroupContainerStyle,
  AvatarGroupMoreStyle,
  AvatarGroupStackStyle,
  AvatarGroupState,
  AvatarIconStyle,
  AvatarImageStyle,
  AvatarState,
  AvatarStatus,
  AvatarStatusDotStyle,
  AvatarStyle,
  AvatarTextStyle,
  AvatarTheme,
  AvatarWithLabelContainerStyle,
  AvatarWithLabelState,
  AvatarWithLabelTextStyle,
  AvatarWithStatusContainerStyle,
  AvatarWithStatusState
} from '../types/components/avatar'
import { createStyleResolver } from '../types/resolver'

const statusColor = (
  status: AvatarStatus,
  colorSchemes: HightideSematicColorSchemeTokens,
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

export const createAvatarContainerTheme = (theme: HightideDesignSystemTokens) => {
  const { colorSchemes, components, shadow } = theme
  const avatar = components.avatar
  const avatarGroup = components.avatarGroup

  return createStyleResolver((state: AvatarState): AvatarStyle => {
    const size = state.size ?? 'md'
    const dimension = avatar[size].size
    const primaryFilled = colorSchemes.primary.filled.base
    const borderRadius = dimension / 2
    const raisedShadow = shadow.raised

    return {
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
  })
}

export const createAvatarImageTheme = (theme: HightideDesignSystemTokens) => {
  const avatar = theme.components.avatar

  return createStyleResolver((state: AvatarState): AvatarImageStyle => {
    const size = state.size ?? 'md'
    const dimension = avatar[size].size
    const borderRadius = dimension / 2

    return {
      position: 'absolute',
      left: 0,
      top: 0,
      width: dimension,
      height: dimension,
      borderRadius,
    } satisfies ImageStyle
  })
}

export const createAvatarTextTheme = (theme: HightideDesignSystemTokens) => {
  const { colorSchemes, components } = theme
  const avatar = components.avatar

  return createStyleResolver((state: AvatarState): AvatarTextStyle => {
    const size = state.size ?? 'md'
    const primaryFilled = colorSchemes.primary.filled.base
    const { textStyle } = avatar[size]

    return {
      color: primaryFilled.foreground,
      fontSize: Number(textStyle.fontSize),
      fontWeight: textStyle.fontWeight as TextStyle['fontWeight'],
      fontFamily: textStyle.fontFamily,
      lineHeight: typeof textStyle.lineHeight === 'number'
        ? textStyle.lineHeight
        : Number(textStyle.lineHeight),
      textAlign: 'center',
    }
  })
}

export const createAvatarIconTheme = (theme: HightideDesignSystemTokens) => {
  const { colorSchemes, components } = theme
  const icon = components.icon

  return createStyleResolver((state: AvatarState): AvatarIconStyle => {
    const size = state.size ?? 'md'
    const primaryFilled = colorSchemes.primary.filled.base

    return {
      size: icon[size].size,
      strokeWidth: icon[size].strokeWidth,
      color: primaryFilled.foreground,
    }
  })
}

export const createAvatarWithStatusContainerTheme = (_theme: HightideDesignSystemTokens) => {
  return createStyleResolver((_state: AvatarWithStatusState): AvatarWithStatusContainerStyle => ({
    position: 'relative',
    alignSelf: 'flex-start',
  }))
}

export const createAvatarWithStatusStatusDotTheme = (theme: HightideDesignSystemTokens) => {
  const { colors, colorSchemes, components } = theme
  const avatar = components.avatar

  return createStyleResolver((state: AvatarWithStatusState): AvatarStatusDotStyle => {
    const size = state.size ?? 'md'
    const status = state.status ?? 'unknown'
    const statusDotSize = avatar[size].statusDotSize

    return {
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
  })
}

export const createAvatarWithStatusTheme = (theme: HightideDesignSystemTokens) => ({
  container: createAvatarWithStatusContainerTheme(theme),
  statusDot: createAvatarWithStatusStatusDotTheme(theme),
})

export const createAvatarWithLabelContainerTheme = (theme: HightideDesignSystemTokens) => {
  const avatarGroup = theme.components.avatarGroup

  return createStyleResolver((_state: AvatarWithLabelState): AvatarWithLabelContainerStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
    gap: avatarGroup.gap,
  }))
}

export const createAvatarWithLabelTextTheme = (theme: HightideDesignSystemTokens) => {
  const { colors, typography } = theme
  const body = typography.body.md

  return createStyleResolver((_state: AvatarWithLabelState): AvatarWithLabelTextStyle => ({
    fontSize: Number(body.fontSize),
    fontWeight: body.fontWeight as TextStyle['fontWeight'],
    fontFamily: body.fontFamily,
    lineHeight: typeof body.lineHeight === 'number'
      ? body.lineHeight
      : Number(body.lineHeight),
    color: colors.onBackground,
    flexShrink: 1,
  }))
}

export const createAvatarWithLabelTheme = (theme: HightideDesignSystemTokens) => ({
  container: createAvatarWithLabelContainerTheme(theme),
  text: createAvatarWithLabelTextTheme(theme),
})

export const createAvatarGroupContainerTheme = (theme: HightideDesignSystemTokens) => {
  const { components } = theme
  const avatar = components.avatar
  const avatarGroup = components.avatarGroup

  return createStyleResolver((state: AvatarGroupState): AvatarGroupContainerStyle => {
    const size = state.size ?? 'md'
    const dimension = avatar[size].size

    return {
      flexDirection: 'row',
      alignItems: 'center',
      gap: avatarGroup.gap,
      height: dimension,
      alignSelf: 'flex-start',
    }
  })
}

export const createAvatarGroupStackTheme = (theme: HightideDesignSystemTokens) => {
  const { components } = theme
  const avatar = components.avatar
  const avatarGroup = components.avatarGroup

  return createStyleResolver((state: AvatarGroupState): AvatarGroupStackStyle => {
    const size = state.size ?? 'md'
    const dimension = avatar[size].size
    const visibleCount = Math.min(state.count ?? avatarGroup.maxShown, avatarGroup.maxShown)
    const stackWidth = dimension * (avatarGroup.overlap * Math.max(visibleCount - 1, 0) + 1)

    return {
      position: 'relative',
      width: stackWidth,
      height: dimension,
    }
  })
}

export const createAvatarGroupMoreTheme = (theme: HightideDesignSystemTokens) => {
  const { colors, components } = theme
  const avatar = components.avatar

  return createStyleResolver((state: AvatarGroupState): AvatarGroupMoreStyle => {
    const size = state.size ?? 'md'
    const dimension = avatar[size].size

    return {
      fontSize: (dimension * 2) / 3,
      color: colors.onBackground,
      flexShrink: 1,
    }
  })
}

export const createAvatarGroupTheme = (theme: HightideDesignSystemTokens) => ({
  container: createAvatarGroupContainerTheme(theme),
  stack: createAvatarGroupStackTheme(theme),
  more: createAvatarGroupMoreTheme(theme),
})

export const createAvatarTheme = (theme: HightideDesignSystemTokens): AvatarTheme => ({
  avatar: createAvatarContainerTheme(theme),
  image: createAvatarImageTheme(theme),
  text: createAvatarTextTheme(theme),
  icon: createAvatarIconTheme(theme),
  withStatus: createAvatarWithStatusTheme(theme),
  withLabel: createAvatarWithLabelTheme(theme),
  group: createAvatarGroupTheme(theme),
})
