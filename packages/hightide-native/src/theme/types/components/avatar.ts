import type {
  ImageStyle,
  TextStyle,
  ViewStyle
} from 'react-native'

import type {
  ColorPairToken,
  IconSize
} from '@helpwave/hightide-design/theme-tokens'
import {
  avatarStatuses,
  type AvatarStatus
} from '@helpwave/hightide-design/component-token-resolvers'

import type { StyleResolverFunction } from '../resolver'
import type { IconStyle } from '../../../icons'

export type { AvatarStatus }
export { avatarStatuses }

export type AvatarState = {
  size?: IconSize | number,
  isGrouped?: boolean,
  groupIndex?: number,
  color?: ColorPairToken,
}

export type AvatarWithStatusState = {
  size?: IconSize | number,
  status?: AvatarStatus,
}

export type AvatarWithLabelState = {
  size?: IconSize | number,
}

export type AvatarGroupState = {
  size?: IconSize | number,
  count?: number,
}

export type AvatarStyle = ViewStyle

export type AvatarImageStyle = ImageStyle

export type AvatarTextStyle = TextStyle

export type AvatarIconStyle = IconStyle

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
