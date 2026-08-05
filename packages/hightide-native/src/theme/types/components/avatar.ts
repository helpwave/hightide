import type {
  ImageStyle,
  TextStyle,
  ViewStyle
} from 'react-native'

import type {
  ColorPairToken,
  ComponentSize
} from '@helpwave/hightide-design/theme-tokens'
import {
  avatarStatuses,
  type AvatarStatus
} from '@helpwave/hightide-design/component-token-resolvers'

import type { Color } from '../color'
import type { StyleResolverFunction } from '../resolver'

export type { AvatarStatus }
export { avatarStatuses }

export type AvatarState = {
  size?: ComponentSize,
  isGrouped?: boolean,
  groupIndex?: number,
  color?: ColorPairToken,
}

export type AvatarWithStatusState = {
  size?: ComponentSize,
  status?: AvatarStatus,
}

export type AvatarWithLabelState = {
  size?: ComponentSize,
}

export type AvatarGroupState = {
  size?: ComponentSize,
  count?: number,
}

export type AvatarStyle = ViewStyle

export type AvatarImageStyle = ImageStyle

export type AvatarTextStyle = TextStyle

export type AvatarIconStyle = {
  size: number,
  strokeWidth: number,
  color: Color,
}

export type AvatarStatusDotStyle = ViewStyle

export type AvatarWithStatusContainerStyle = ViewStyle

export type AvatarWithLabelContainerStyle = ViewStyle

export type AvatarWithLabelTextStyle = TextStyle

export type AvatarGroupContainerStyle = ViewStyle

export type AvatarGroupStackStyle = ViewStyle

export type AvatarGroupMoreStyle = TextStyle

export type AvatarThemeResolvers = {
  container: StyleResolverFunction<AvatarState, AvatarStyle>,
  image: StyleResolverFunction<AvatarState, AvatarImageStyle>,
  text: StyleResolverFunction<AvatarState, AvatarTextStyle>,
  icon: StyleResolverFunction<AvatarState, AvatarIconStyle>,
  withStatus: {
    container: StyleResolverFunction<AvatarWithStatusState, AvatarWithStatusContainerStyle>,
    statusDot: StyleResolverFunction<AvatarWithStatusState, AvatarStatusDotStyle>,
  },
  withLabel: {
    container: StyleResolverFunction<AvatarWithLabelState, AvatarWithLabelContainerStyle>,
    text: StyleResolverFunction<AvatarWithLabelState, AvatarWithLabelTextStyle>,
  },
  group: {
    container: StyleResolverFunction<AvatarGroupState, AvatarGroupContainerStyle>,
    stack: StyleResolverFunction<AvatarGroupState, AvatarGroupStackStyle>,
    more: StyleResolverFunction<AvatarGroupState, AvatarGroupMoreStyle>,
  },
}
