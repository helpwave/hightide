import type { ImageProps } from '../../../utils/image'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | null

export type AvatarStatus = 'online' | 'offline' | 'away' | 'busy' | 'unknown'

export type AvatarImageConfig = {
  avatarUrl: string,
  alt: string,
}

export type AvatarImageProps = ImageProps
