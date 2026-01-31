import type { HTMLAttributes } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { UserIcon } from 'lucide-react'
import { Visibility } from '../layout/Visibility'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | null

type ImageConfig = {
  avatarUrl: string,
  alt: string,
}


export type AvatarProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  image?: ImageConfig,
  name?: string,
  size?: AvatarSize,
}

/**
 * A component for showing a profile picture
 */
export const Avatar = ({
  image: initialImage,
  name,
  size = 'md',
  ...props
}: AvatarProps) => {
  const [hasError, setHasError] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [image, setImage] = useState(initialImage)

  const displayName = useMemo(() => {
    const maxLetters = size === 'sm' ? 1 : 2
    return (name ?? '')
      .split(' ')
      .filter((_, index) => index < maxLetters)
      .map(value => value[0])
      .join('')
      .toUpperCase()
  }, [name, size])

  const isShowingImage = !!image && (!hasError || !hasLoaded)

  useEffect(() => {
    if(initialImage?.avatarUrl !== image?.avatarUrl) {
      setHasError(false)
      setHasLoaded(false)
    }
    setImage(initialImage)
  }, [image?.avatarUrl, initialImage])

  return (
    <div
      {...props}
      data-name={props['data-name'] ?? 'avatar'}
      data-size={props['data-size'] ?? size ?? undefined}
    >
      <Visibility isVisible={isShowingImage}>
        <img
          key={image?.avatarUrl}
          src={image?.avatarUrl}
          alt={image?.alt}
          data-name="avatar-image"
          onLoad={() => setHasLoaded(true)}
          onError={() => setHasError(true)}
          data-error={hasError ? '' : undefined}
          data-loaded={hasLoaded ? '' : undefined}
        />
      </Visibility>
      {name ? displayName : (<UserIcon />)}
    </div>
  )
}

export type AvatarGroupProps = HTMLAttributes<HTMLDivElement> & {
  avatars: Omit<AvatarProps, 'size'>[],
  showTotalNumber?: boolean,
  size?: AvatarSize,
}

/**
 * A component for showing a group of Avatar's
 */
export const AvatarGroup = ({
  avatars,
  showTotalNumber = true,
  size = 'md',
  ...props
}: AvatarGroupProps) => {
  const maxShownProfiles = 5
  const displayedProfiles = avatars.length < maxShownProfiles ? avatars : avatars.slice(0, maxShownProfiles)
  const notDisplayedProfiles = avatars.length - maxShownProfiles
  const group = (
    <div className="avatar-group-container">
      {displayedProfiles.map((avatar, index) => (
        <Avatar
          {...avatar}
          key={index}
          size={size}
          data-group=""
        />
      ))}
    </div>
  )


  return (
    <div
      {...props}
      data-name={props['data-name'] ?? 'avatar-group'}
      data-size={size ?? undefined}
    >
      {group}
      {showTotalNumber && notDisplayedProfiles > 0 && (
        <span
          data-name="avatar-group-more"
          data-size={size}
        >
          {`+ ${notDisplayedProfiles}`}
        </span>
      )}
    </div>
  )
}