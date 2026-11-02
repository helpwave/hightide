import { AvatarComponent } from './AvatarComponent'
import { AvatarContext } from './AvatarContext'
import { AvatarFallback } from './AvatarFallback'
import { AvatarImage } from './AvatarImage'
import { AvatarName } from './AvatarName'
import { AvatarRoot } from './AvatarRoot'
import { AvatarStatusIndicator } from './AvatarStatusIndicator'

const Avatar = Object.assign(AvatarComponent, {
  Root: AvatarRoot,
  Fallback: AvatarFallback,
  Name: AvatarName,
  Image: AvatarImage,
  StatusIndicator: AvatarStatusIndicator,
  Context: AvatarContext,
})

export { Avatar }
