import type {
  ImageStyle,
  TextStyle,
  ViewStyle
} from 'react-native'

import type { ComponentSize } from '@helpwave/hightide-design/component-tokens'

import type { StyleResolverFunction } from '../resolver'

export type AvatarStatus = 'online' | 'offline' | 'away' | 'busy' | 'unknown'

export type AvatarState = {
  size?: ComponentSize,
  isGrouped?: boolean,
  groupIndex?: number,
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
  color: string,
}

export type AvatarStatusDotStyle = ViewStyle

export type AvatarWithStatusContainerStyle = ViewStyle

export type AvatarWithLabelContainerStyle = ViewStyle

export type AvatarWithLabelTextStyle = TextStyle

export type AvatarGroupContainerStyle = ViewStyle

export type AvatarGroupStackStyle = ViewStyle

export type AvatarGroupMoreStyle = TextStyle

export type AvatarTheme = {
  avatar: StyleResolverFunction<AvatarState, AvatarStyle>,
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
