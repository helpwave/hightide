import type {
  ImageStyle,
  TextStyle,
  ViewStyle
} from 'react-native'

import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'
import {
  avatarStatuses,
  type AvatarSize,
  type AvatarStatus
} from '@helpwave/hightide-design/component-token-resolvers'

import type { StyleResolverFunction } from '../resolver'
import type { IconStyle } from '../../../icons'

export type { AvatarSize, AvatarStatus }
export { avatarStatuses }

export type AvatarState = {
  size?: AvatarSize | number,
  isGrouped?: boolean,
  groupIndex?: number,
  color?: ColorPairToken,
}

export type AvatarWithStatusState = {
  size?: AvatarSize | number,
  color?: ColorPairToken,
  status?: AvatarStatus,
}

export type AvatarGroupState = {
  size?: AvatarSize | number,
  color?: ColorPairToken,
  count?: number,
}

export type AvatarStyle = ViewStyle

export type AvatarImageStyle = ImageStyle

export type AvatarTextStyle = TextStyle

export type AvatarIconStyle = IconStyle

export type AvatarStatusDotStyle = ViewStyle

export type AvatarGroupContainerStyle = ViewStyle

export type AvatarGroupStackStyle = ViewStyle

export type AvatarGroupTextStyle = TextStyle

export type AvatarThemeResolvers = {
  container: StyleResolverFunction<AvatarState, AvatarStyle>,
  image: StyleResolverFunction<AvatarState, AvatarImageStyle>,
  text: StyleResolverFunction<AvatarState, AvatarTextStyle>,
  icon: StyleResolverFunction<AvatarState, AvatarIconStyle>,
}

export type AvatarWithStatusThemeResolvers = {
  avatar: StyleResolverFunction<
    AvatarWithStatusState,
    AvatarThemeResolvers
  >,
  statusDot: StyleResolverFunction<AvatarWithStatusState, AvatarStatusDotStyle>,
}

export type AvatarGroupThemeResolvers = {
  avatar: StyleResolverFunction<
    AvatarGroupState,
    AvatarThemeResolvers
  >,
  container: StyleResolverFunction<AvatarGroupState, AvatarGroupContainerStyle>,
  avatarStack: StyleResolverFunction<AvatarGroupState, AvatarGroupStackStyle>,
  text: StyleResolverFunction<AvatarGroupState, AvatarGroupTextStyle>,
}
