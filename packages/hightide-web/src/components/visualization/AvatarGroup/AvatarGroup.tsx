import { AvatarGroupAdditionalText } from './AvatarGroupAdditionalText'
import { AvatarGroupComponent } from './AvatarGroupComponent'
import { AvatarGroupContainer } from './AvatarGroupContainer'
import { AvatarGroupOverlap } from './AvatarGroupOverlap'

const AvatarGroup = Object.assign(AvatarGroupComponent, {
  Container: AvatarGroupContainer,
  Overlap: AvatarGroupOverlap,
  AdditionalText: AvatarGroupAdditionalText,
})

export { AvatarGroup }
