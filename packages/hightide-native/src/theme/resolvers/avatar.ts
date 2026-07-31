import type {
  ImageStyle,
  TextStyle
} from 'react-native'

import type { HightideDesignSystemTokens } from '@helpwave/hightide-design/design-system'

import type {
  AvatarGroupContainerStyle,
  AvatarGroupMoreStyle,
  AvatarGroupStackStyle,
  AvatarGroupState,
  AvatarIconStyle,
  AvatarImageStyle,
  AvatarState,
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

export const createAvatarContainerTheme = (theme: HightideDesignSystemTokens) => {
  const { components, shadow } = theme
  const avatar = components.avatar
  const avatarGroup = components.avatarGroup

  return createStyleResolver((state: AvatarState): AvatarStyle => {
    const size = state.size ?? 'md'
    const { container } = avatar[size]
    const dimension = container.size
    const raisedShadow = shadow.raised

    return {
      position: state.isGrouped ? 'absolute' : 'relative',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: dimension,
      height: dimension,
      minWidth: dimension,
      maxWidth: dimension,
      minHeight: dimension,
      maxHeight: dimension,
      padding: container.padding,
      borderRadius: container.borderRadius,
      backgroundColor: container.color,
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
    const { size: dimension, borderRadius } = avatar[size].container

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
  const avatar = theme.components.avatar

  return createStyleResolver((state: AvatarState): AvatarTextStyle => {
    const size = state.size ?? 'md'
    const { textStyle, color } = avatar[size].text

    return {
      color,
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
  const { components } = theme
  const icon = components.icon
  const avatar = components.avatar

  return createStyleResolver((state: AvatarState): AvatarIconStyle => {
    const size = state.size ?? 'md'

    return {
      size: icon[size].size,
      strokeWidth: icon[size].strokeWidth,
      color: avatar[size].text.color,
    }
  })
}

export const createAvatarWithStatusContainerTheme = (theme: HightideDesignSystemTokens) => {
  const avatar = theme.components.avatar

  return createStyleResolver((state: AvatarWithStatusState): AvatarWithStatusContainerStyle => {
    const size = state.size ?? 'md'
    const dimension = avatar[size].container.size

    return {
      position: 'relative',
      alignSelf: 'flex-start',
      width: dimension,
      height: dimension,
      minWidth: dimension,
      maxWidth: dimension,
      minHeight: dimension,
      maxHeight: dimension,
    }
  })
}

export const createAvatarWithStatusStatusDotTheme = (theme: HightideDesignSystemTokens) => {
  const { colors, components } = theme
  const avatar = components.avatar

  return createStyleResolver((state: AvatarWithStatusState): AvatarStatusDotStyle => {
    const size = state.size ?? 'md'
    const status = state.status ?? 'unknown'
    const statusDot = avatar[size].statusDot

    return {
      position: 'absolute',
      right: 0,
      bottom: 0,
      zIndex: 1,
      width: statusDot.size,
      height: statusDot.size,
      borderRadius: statusDot.borderRadius,
      borderWidth: statusDot.borderWidth,
      borderColor: colors.background,
      backgroundColor: statusDot.color[status],
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
    const dimension = avatar[size].container.size

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
    const dimension = avatar[size].container.size
    const visibleCount = Math.min(state.count ?? avatarGroup.maxShown, avatarGroup.maxShown)
    const stackWidth = dimension * (avatarGroup.overlap * Math.max(visibleCount - 1, 0) + 1)

    return {
      position: 'relative',
      width: stackWidth,
      height: dimension,
      minWidth: stackWidth,
      maxWidth: stackWidth,
      minHeight: dimension,
      maxHeight: dimension,
    }
  })
}

export const createAvatarGroupMoreTheme = (theme: HightideDesignSystemTokens) => {
  const { colors, components } = theme
  const avatar = components.avatar

  return createStyleResolver((state: AvatarGroupState): AvatarGroupMoreStyle => {
    const size = state.size ?? 'md'
    const dimension = avatar[size].container.size

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
