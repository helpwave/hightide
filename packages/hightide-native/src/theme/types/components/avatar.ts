import type {
  ImageStyle,
  TextStyle,
  ViewStyle
} from 'react-native'
import {
  avatarStatuses,
  type AvatarSize,
  type AvatarStatus,
} from '@helpwave/hightide-design/component-tokens'
import type { TokenContextInput } from '../../token-context'
import type { StyleLeaf } from '../resolver'
import type { IconStyle } from '../../../icons'

export type AvatarState = TokenContextInput
export type AvatarWithStatusState = TokenContextInput

export type { AvatarSize, AvatarStatus }
export { avatarStatuses }

export type AvatarStyle = ViewStyle
export type AvatarImageStyle = ImageStyle
export type AvatarTextStyle = TextStyle
export type AvatarIconStyle = IconStyle
export type AvatarStatusDotStyle = ViewStyle
export type AvatarGroupContainerStyle = ViewStyle
export type AvatarGroupStackStyle = ViewStyle
export type AvatarGroupTextStyle = TextStyle

export type AvatarThemeResolvers = {
  container: StyleLeaf<AvatarStyle>,
  image: StyleLeaf<AvatarImageStyle>,
  text: StyleLeaf<AvatarTextStyle>,
  icon: StyleLeaf<AvatarIconStyle>,
}

export type AvatarWithStatusThemeResolvers = {
  statusDot: StyleLeaf<AvatarStatusDotStyle>,
}

export type AvatarGroupThemeResolvers = {
  container: StyleLeaf<AvatarGroupContainerStyle>,
  avatarStack: StyleLeaf<AvatarGroupStackStyle>,
  text: StyleLeaf<AvatarGroupTextStyle>,
}
