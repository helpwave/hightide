import type { HTMLAttributes, ReactNode } from 'react'
import { useCallback, useMemo, useState } from 'react'
import clsx from 'clsx'
import type { LoadingState } from '@helpwave/hightide-utils/utils'

import type { ImageComponent } from '../../../utils/image'
import { AvatarContext } from './AvatarContext'
import type { AvatarImageConfig, AvatarSize, AvatarStatus } from './AvatarTypes'

const DefaultAvatarImage: ImageComponent = 'img'

export type AvatarRootProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: ReactNode,
  size?: AvatarSize,
  name?: string,
  image?: AvatarImageConfig,
  status?: AvatarStatus,
  hasStatusIndicator?: boolean,
  ImageComponent?: ImageComponent,
}

export function AvatarRoot({
  children,
  size = 'md',
  name,
  image,
  status,
  hasStatusIndicator = false,
  ImageComponent = DefaultAvatarImage,
  className,
  ...props
}: AvatarRootProps) {
  const [loadedUrl, setLoadedUrl] = useState<string | undefined>(undefined)
  const [erroredUrl, setErroredUrl] = useState<string | undefined>(undefined)
  const avatarUrl = image?.avatarUrl
  const hasImageError = !!avatarUrl && erroredUrl === avatarUrl
  const imageLoadingState: LoadingState = !avatarUrl || loadedUrl === avatarUrl || hasImageError
    ? 'idle'
    : 'loading'
  const reportImageLoaded = useCallback((url: string) => {
    setLoadedUrl(url)
  }, [])
  const reportImageError = useCallback((url: string) => {
    setErroredUrl(url)
  }, [])
  const contextValue = useMemo(() => ({
    hasStatusIndicator,
    imageLoadingState,
    hasImageError,
    reportImageLoaded,
    reportImageError,
    size,
    name,
    image,
    status,
    ImageComponent,
  }), [
    hasStatusIndicator,
    imageLoadingState,
    hasImageError,
    reportImageLoaded,
    reportImageError,
    size,
    name,
    image,
    status,
    ImageComponent,
  ])

  return (
    <AvatarContext.Provider value={contextValue}>
      <div
        {...props}
        className={clsx('avatar', className)}
        data-size={size ?? undefined}
        data-loading-state={imageLoadingState}
      >
        {children}
      </div>
    </AvatarContext.Provider>
  )
}
