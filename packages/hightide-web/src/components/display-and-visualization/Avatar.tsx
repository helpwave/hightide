import type { ElementType, HTMLAttributes, ImgHTMLAttributes, ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import { UserIcon } from 'lucide-react'
import { Visibility } from '../layout/Visibility'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | null

type ImageConfig = {
  avatarUrl: string,
  alt: string,
}

export type AvatarImageProps = ImgHTMLAttributes<HTMLImageElement>

const DefaultAvatarImage: ElementType<AvatarImageProps> = 'img'

export type AvatarProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  image?: ImageConfig,
  name?: string,
  size?: AvatarSize,
  ImageComponent?: ElementType<AvatarImageProps>,
}

/**
 * A component for showing a profile picture
 */
export const Avatar = ({
  image: initialImage,
  name,
  size = 'md',
  ImageComponent = DefaultAvatarImage,
  ...props
}: AvatarProps) => {
  const [hasError, setHasError] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [image, setImage] = useState(initialImage)
  const Image = ImageComponent

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
      data-name="avatar"
      data-size={size ?? undefined}
    >
      <Visibility isVisible={isShowingImage}>
        <Image
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
  'avatars': Omit<AvatarProps, 'size'>[],
  'showTotalNumber'?: boolean,
  'size'?: AvatarSize,
  'data-name'?: string,
  'ImageComponent'?: ElementType<AvatarImageProps>,
}

/**
 * A component for showing a group of Avatar's
 */
export const AvatarGroup = ({
  avatars,
  showTotalNumber = true,
  size = 'md',
  ImageComponent,
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
          ImageComponent={avatar.ImageComponent ?? ImageComponent}
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

export type AvatarStatus = 'online' | 'offline' | 'away' | 'busy' | 'unknown'

export type AvatarWithStatusProps = AvatarProps & {
  status?: AvatarStatus,
}

export const AvatarWithStatus = ({
  status = 'unknown',
  className,
  size = 'md',
  ...avatarProps
}: AvatarWithStatusProps) => {
  return (
    <div
      className={clsx(className)}
      data-name="avatar-with-status"
      data-size={size ?? undefined}
    >
      <Avatar {...avatarProps} size={size} />
      <div
        data-name="avatar-with-status-dot"
        data-size={size ?? undefined}
        data-status={status}
      />
    </div>
  )
}

type AvatarWithLabelPosition = 'left' | 'right'

export type AvatarWithLabelProps = AvatarProps & {
  label: ReactNode,
  labelPosition?: AvatarWithLabelPosition,
}

/**
 * An avatar with a label displayed beside it
 */
export const AvatarWithLabel = ({
  label,
  labelPosition = 'left',
  className,
  size = 'md',
  ...avatarProps
}: AvatarWithLabelProps) => {
  const avatar = <Avatar {...avatarProps} size={size} />
  const labelElement = (
    <span className="avatar-with-label-text">
      {label}
    </span>
  )

  return (
    <div
      className={clsx('avatar-with-label', className)}
      data-label-position={labelPosition}
      data-size={size ?? undefined}
    >
      {labelPosition === 'left' ? labelElement : avatar}
      {labelPosition === 'left' ? avatar : labelElement}
    </div>
  )
}
