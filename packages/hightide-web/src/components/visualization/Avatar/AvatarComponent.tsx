import type { HTMLAttributes } from 'react'

import type { ImageComponent } from '../../../utils/image'
import { AvatarFallback } from './AvatarFallback'
import { AvatarImage } from './AvatarImage'
import { AvatarName } from './AvatarName'
import { AvatarRoot } from './AvatarRoot'
import { AvatarStatusIndicator } from './AvatarStatusIndicator'
import type { AvatarImageConfig, AvatarImageProps, AvatarSize, AvatarStatus } from './AvatarTypes'

export type AvatarProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  image?: AvatarImageConfig,
  name?: string,
  size?: AvatarSize,
  status?: AvatarStatus,
  hasStatusIndicator?: boolean,
  ImageComponent?: ImageComponent,
  fallbackProps?: HTMLAttributes<HTMLDivElement>,
  nameProps?: HTMLAttributes<HTMLSpanElement>,
  imageProps?: AvatarImageProps,
  statusIndicatorProps?: HTMLAttributes<HTMLDivElement>,
}

export function AvatarComponent({
  image,
  name,
  size,
  status = 'unknown',
  hasStatusIndicator = false,
  ImageComponent,
  fallbackProps,
  nameProps,
  imageProps,
  statusIndicatorProps,
  ...props
}: AvatarProps) {
  return (
    <AvatarRoot
      {...props}
      image={image}
      name={name}
      size={size}
      status={status}
      ImageComponent={ImageComponent}
      hasStatusIndicator={hasStatusIndicator}
    >
      <AvatarFallback {...fallbackProps} />
      <AvatarName {...nameProps} />
      <AvatarImage {...imageProps} />
      <AvatarStatusIndicator {...statusIndicatorProps} />
    </AvatarRoot>
  )
}
