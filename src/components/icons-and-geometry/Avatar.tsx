import Image from 'next/image'
import clsx from 'clsx'

export const avtarSizeList = ['tiny', 'small', 'medium', 'large'] as const
export type AvatarSize = typeof avtarSizeList[number]
export const avatarSizeMapping: Record<AvatarSize, number> = {
  tiny: 24,
  small: 32,
  medium: 48,
  large: 64
}

export type AvatarProps = {
  avatarUrl: string,
  alt: string,
  size?: AvatarSize,
  className?: string,
}

/**
 * A component for showing a profile picture
 */
export const Avatar = ({ avatarUrl, alt, size = 'medium', className = '' }: AvatarProps) => {
  // TODO remove later
  avatarUrl = 'https://cdn.helpwave.de/boringavatar.svg'

  const avtarSize = {
    tiny: 24,
    small: 32,
    medium: 48,
    large: 64,
  }[size]

  const style = {
    width: avtarSize + 'px',
    height: avtarSize + 'px',
    maxWidth: avtarSize + 'px',
    maxHeight: avtarSize + 'px',
    minWidth: avtarSize + 'px',
    minHeight: avtarSize + 'px',
  }

  return (
    // TODO transparent or white background later
    <div className={clsx(`rounded-full bg-primary`, className)} style={style}>
      <Image
        className="rounded-full border border-gray-200"
        style={style}
        src={avatarUrl}
        alt={alt}
        width={avtarSize}
        height={avtarSize}
      />
    </div>
  )
}

export type AvatarGroupProps = {
  avatars: Omit<AvatarProps, 'size'>[],
  maxShownProfiles?: number,
  size?: AvatarSize,
}

/**
 * A component for showing a group of Avatar's
 */
export const AvatarGroup = ({
                              avatars,
                              maxShownProfiles = 5,
                              size = 'tiny'
                            }: AvatarGroupProps) => {
  const displayedProfiles = avatars.length < maxShownProfiles ? avatars : avatars.slice(0, maxShownProfiles)
  const diameter = avatarSizeMapping[size]
  const stackingOverlap = 0.5 // given as a percentage
  const notDisplayedProfiles = avatars.length - maxShownProfiles
  const avatarGroupWidth = diameter * (stackingOverlap * (displayedProfiles.length - 1) + 1)
  return (
    <div className="row relative" style={{ height: diameter + 'px' }}>
      <div style={{ width: avatarGroupWidth + 'px' }}>
        {displayedProfiles.map((avatar, index) => (
          <div
            key={index}
            className="absolute"
            style={{ left: (index * diameter * stackingOverlap) + 'px', zIndex: maxShownProfiles - index }}
          >
            <Avatar avatarUrl={avatar.avatarUrl} alt={avatar.alt} size={size}/>
          </div>
        ))}
      </div>
      {
        notDisplayedProfiles > 0 && (
          <div
            className="truncate row items-center"
            style={{ fontSize: (diameter / 2) + 'px', marginLeft: (1 + diameter / 16) + 'px' }}
          >
            <span>+ {notDisplayedProfiles}</span>
          </div>
        )
      }
    </div>
  )
}

export default { Avatar, AvatarGroup }
