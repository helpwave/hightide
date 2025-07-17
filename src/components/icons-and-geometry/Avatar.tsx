import clsx from 'clsx'
import type { CSSProperties } from 'react'
import { useState } from 'react'
import { useMemo } from 'react'
import { UserIcon } from 'lucide-react'
import Image from 'next/image'

const avtarSizeList = ['sm', 'md', 'lg', 'xl'] as const
export type AvatarSize = typeof avtarSizeList[number]
const avatarSizeMapping: Record<AvatarSize, number> = {
  sm: 18,
  md: 24,
  lg: 32,
  xl: 48
}
const textClassNameMapping: Record<AvatarSize, string> = {
  sm: 'text-xs font-semibold',
  md: 'text-sm font-semibold',
  lg: 'text-lg font-semibold',
  xl: 'text-2xl font-bold',
}

export const AvatarUtil = {
  avatarSizeMapping,
  sizes: avtarSizeList
}


type ImageConfig = {
  avatarUrl: string,
  alt: string,
}


export type AvatarProps = {
  image?: ImageConfig,
  name?: string,
  size?: AvatarSize,
  fullyRounded?: boolean,
  className?: string,
}

/**
 * A component for showing a profile picture
 */
export const Avatar = ({ image, name, size = 'md', fullyRounded, className = '' }: AvatarProps) => {
  const pixels = avatarSizeMapping[size]
  const [hasImageError, setHasImageError] = useState<boolean>(false)

  const sizeStyle: CSSProperties = {
    minWidth: pixels,
    maxWidth: pixels,
    minHeight: pixels,
    maxHeight: pixels,
  }

  const textClassName = textClassNameMapping[size]

  const displayName = useMemo(() => {
    const maxLetters = size === 'sm' ? 1 : 2
    return (name ?? '')
      .split(' ')
      .filter((_, index) => index < maxLetters)
      .map(value => value[0])
      .join('')
      .toUpperCase()
  }, [name, size])

  const rounding = {
    'rounded-full': fullyRounded,
    'rounded-lg': !fullyRounded && !(size === 'sm' || size === 'md'),
    'rounded-sm': !fullyRounded && (size === 'sm' || size === 'md'),
  }

  return (
    <div
      className={clsx(
        `relative bg-primary text-on-primary`,
        rounding,
        className
      )}
      style={sizeStyle}
    >
      {name && (!image || hasImageError) && (
        <span className={clsx(textClassName, 'absolute z-[1] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2')}>
          {displayName}
        </span>
      )}
      {!name && (
        <div className={clsx('absolute z-[1] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2')}>
          <UserIcon size={Math.round(pixels * 3 / 4)}/>
        </div>
      )}
      {image && !hasImageError && (
        <Image
          className={clsx(
            'absolute z-[2] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
            rounding
          )}
          src={image.avatarUrl}
          alt={image.alt}
          style={sizeStyle}
          width={pixels}
          height={pixels}
          onError={() => setHasImageError(true)}
        />
      )}
    </div>
  )
}

export type AvatarGroupProps = {
  avatars: Omit<AvatarProps, 'size' | 'fullyRounded'>[],
  maxShownProfiles?: number,
  showTotalNumber?: boolean,
  size?: AvatarSize,
  fullyRounded?: boolean,
}

/**
 * A component for showing a group of Avatar's
 */
export const AvatarGroup = ({
                              avatars,
                              maxShownProfiles = 5,
                              showTotalNumber = true,
                              size = 'md',
                              fullyRounded
                            }: AvatarGroupProps) => {
  const displayedProfiles = avatars.length < maxShownProfiles ? avatars : avatars.slice(0, maxShownProfiles)
  const diameter = avatarSizeMapping[size]
  const stackingOverlap = 0.5 // given as a percentage
  const notDisplayedProfiles = avatars.length - maxShownProfiles
  const avatarGroupWidth = diameter * (stackingOverlap * (displayedProfiles.length - 1) + 1)
  return (
    <div className="flex-row-2 relative" style={{ height: diameter + 'px' }}>
      <div style={{ width: avatarGroupWidth + 'px' }}>
        {displayedProfiles.map((avatar, index) => (
          <div
            key={index}
            className="absolute"
            style={{ left: (index * diameter * stackingOverlap) + 'px', zIndex: maxShownProfiles - index }}
          >
            <Avatar {...avatar} size={size} fullyRounded={fullyRounded}
                    className={clsx('shadow-side shadow-r-4 shadow-hard', avatar.className)}/>
          </div>
        ))}
      </div>
      {
        showTotalNumber && notDisplayedProfiles > 0 && (
          <div
            className={clsx(textClassNameMapping[size], 'flex-row-2 truncate items-center')}
          >
            <span>+ {notDisplayedProfiles}</span>
          </div>
        )
      }
    </div>
  )
}