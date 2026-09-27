import clsx from 'clsx'

import { useAvatarContext } from './AvatarContext'
import type { AvatarImageProps } from './AvatarTypes'

export function AvatarImage({
  className,
  onLoad,
  onError,
  ...props
}: AvatarImageProps) {
  const {
    image,
    imageLoadingState,
    hasImageError,
    reportImageLoaded,
    reportImageError,
    ImageComponent,
  } = useAvatarContext()

  if (!image?.avatarUrl || hasImageError) return null

  return (
    <ImageComponent
      src={image.avatarUrl}
      alt={image.alt}
      {...props}
      key={image.avatarUrl}
      className={clsx('avatar-image', className)}
      data-loaded={imageLoadingState === 'idle' ? '' : undefined}
      onLoad={(event) => {
        reportImageLoaded(image.avatarUrl)
        onLoad?.(event)
      }}
      onError={(event) => {
        reportImageError(image.avatarUrl)
        onError?.(event)
      }}
    />
  )
}
