import { createContext, useContext } from 'react'
import type { LoadingState } from '@helpwave/hightide-utils/utils'

import type { ImageComponent } from '../../../utils/image'
import type { AvatarImageConfig, AvatarSize, AvatarStatus } from './AvatarTypes'

export type AvatarContextValue = {
  hasStatusIndicator: boolean,
  imageLoadingState: LoadingState,
  hasImageError: boolean,
  reportImageLoaded: (avatarUrl: string) => void,
  reportImageError: (avatarUrl: string) => void,
  size: AvatarSize,
  name?: string,
  image?: AvatarImageConfig,
  status?: AvatarStatus,
  ImageComponent: ImageComponent,
}

export const AvatarContext = createContext<AvatarContextValue | null>(null)

export function useAvatarContext() {
  const context = useContext(AvatarContext)
  if (!context) {
    throw new Error('Avatar components must be used within an Avatar.Root')
  }
  return context
}

export function isImageShown(context: AvatarContextValue) {
  return !!context.image?.avatarUrl && context.imageLoadingState === 'idle' && !context.hasImageError
}
