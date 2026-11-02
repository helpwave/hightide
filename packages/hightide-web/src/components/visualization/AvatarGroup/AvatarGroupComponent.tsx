import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

import type { ImageComponent } from '../../../utils/image'
import { Avatar } from '../Avatar/Avatar'
import type { AvatarProps } from '../Avatar/AvatarComponent'
import type { AvatarSize } from '../Avatar/AvatarTypes'
import { AvatarGroupAdditionalText } from './AvatarGroupAdditionalText'
import type { AvatarGroupContainerProps } from './AvatarGroupContainer'
import { AvatarGroupContainer } from './AvatarGroupContainer'
import { AvatarGroupOverlap } from './AvatarGroupOverlap'

const maxShownProfiles = 5

export type AvatarGroupProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  avatars: Omit<AvatarProps, 'size'>[],
  hasAdditionalText?: boolean,
  size?: AvatarSize,
  ImageComponent?: ImageComponent,
  containerProps?: Omit<AvatarGroupContainerProps, 'children' | 'size'>,
  overlapProps?: HTMLAttributes<HTMLDivElement>,
  additionalTextProps?: HTMLAttributes<HTMLSpanElement>,
}

export function AvatarGroupComponent({
  avatars,
  hasAdditionalText = true,
  size = 'md',
  ImageComponent,
  containerProps,
  overlapProps,
  additionalTextProps,
  className,
  ...props
}: AvatarGroupProps) {
  const displayedProfiles = avatars.length < maxShownProfiles ? avatars : avatars.slice(0, maxShownProfiles)
  const hiddenProfileCount = avatars.length - maxShownProfiles

  return (
    <AvatarGroupContainer
      {...props}
      {...containerProps}
      size={size}
      className={clsx(className, containerProps?.className)}
    >
      <AvatarGroupOverlap {...overlapProps}>
        {displayedProfiles.map((avatar, index) => (
          <Avatar
            {...avatar}
            key={index}
            size={size}
            className={clsx('avatar-group-avatar', avatar.className)}
            ImageComponent={avatar.ImageComponent ?? ImageComponent}
          />
        ))}
      </AvatarGroupOverlap>
      {hasAdditionalText && hiddenProfileCount > 0 && (
        <AvatarGroupAdditionalText {...additionalTextProps}>
          {additionalTextProps?.children ?? `+ ${hiddenProfileCount}`}
        </AvatarGroupAdditionalText>
      )}
    </AvatarGroupContainer>
  )
}
