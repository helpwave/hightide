import {
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type ReactNode
} from 'react'
import {
  Image,
  Text,
  View,
  type ImageProps,
  type StyleProp,
  type ViewProps,
  type ViewStyle
} from 'react-native'
import { User } from 'lucide-react-native'

import type { ElementSize } from '@helpwave/hightide-design/types'

import { useTheme } from '../../global-contexts/theme/ThemeContext'
import type {
  AvatarGroupMoreStyle,
  AvatarGroupStackStyle,
  AvatarImageStyle,
  AvatarIconStyle,
  AvatarStatus,
  AvatarStyle,
  AvatarTextStyle,
  AvatarWithLabelContainerStyle,
  AvatarWithLabelTextStyle,
  AvatarWithStatusContainerStyle,
  AvatarStatusDotStyle
} from '../../theme/types/components/avatar'
import type { StyleOverwrite } from '../../theme/types/resolver'

export type AvatarSize = ElementSize

type ImageConfig = {
  avatarUrl: string,
  alt: string,
}

export type AvatarImageProps = Omit<ImageProps, 'source'> & {
  source: { uri: string },
  alt?: string,
}

const DefaultAvatarImage: ComponentType<AvatarImageProps> = ({ alt, ...props }) => (
  <Image
    {...props}
    accessibilityLabel={alt}
  />
)

export const AvatarUtil = {
  sizes: ['xs', 'sm', 'md', 'lg'] as const satisfies readonly ElementSize[],
  statuses: ['online', 'offline', 'away', 'busy', 'unknown'] as const satisfies readonly AvatarStatus[],
}

export type AvatarProps = Omit<ViewProps, 'children' | 'style'> & {
  image?: ImageConfig,
  name?: string,
  size?: AvatarSize,
  ImageComponent?: ComponentType<AvatarImageProps>,
  style?: StyleProp<ViewStyle>,
  avatarStyle?: StyleOverwrite<{ size?: ElementSize, isGrouped?: boolean, groupIndex?: number }, AvatarStyle>,
  imageStyle?: StyleOverwrite<{ size?: ElementSize, isGrouped?: boolean, groupIndex?: number }, AvatarImageStyle>,
  textStyle?: StyleOverwrite<{ size?: ElementSize, isGrouped?: boolean, groupIndex?: number }, AvatarTextStyle>,
  iconStyle?: StyleOverwrite<{ size?: ElementSize, isGrouped?: boolean, groupIndex?: number }, AvatarIconStyle>,
  isGrouped?: boolean,
  groupIndex?: number,
}

export const Avatar = ({
  image: initialImage,
  name,
  size = 'md',
  ImageComponent = DefaultAvatarImage,
  style,
  avatarStyle,
  imageStyle,
  textStyle,
  iconStyle,
  isGrouped = false,
  groupIndex,
  ...props
}: AvatarProps) => {
  const { theme } = useTheme()
  const [hasError, setHasError] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [image, setImage] = useState(initialImage)
  const ImageElement = ImageComponent

  const state = useMemo(() => ({
    size,
    isGrouped,
    groupIndex,
  }), [size, isGrouped, groupIndex])

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
  const isShowingFallback = !hasLoaded || hasError

  useEffect(() => {
    if (initialImage?.avatarUrl !== image?.avatarUrl) {
      setHasError(false)
      setHasLoaded(false)
    }
    setImage(initialImage)
  }, [image?.avatarUrl, initialImage])

  const resolvedAvatar = theme.components.avatar.avatar(state, avatarStyle)
  const resolvedImage = theme.components.avatar.image(state, imageStyle)
  const resolvedText = theme.components.avatar.text(state, textStyle)
  const resolvedIcon = theme.components.avatar.icon(state, iconStyle)

  return (
    <View
      {...props}
      style={[resolvedAvatar, style]}
    >
      {isShowingImage && (
        <ImageElement
          key={image?.avatarUrl}
          source={{ uri: image?.avatarUrl ?? '' }}
          alt={image?.alt}
          style={[resolvedImage, { opacity: hasLoaded && !hasError ? 1 : 0 }]}
          onLoad={() => setHasLoaded(true)}
          onError={() => setHasError(true)}
        />
      )}
      {isShowingFallback && (
        name ? (
          <Text style={resolvedText}>{displayName}</Text>
        ) : (
          <User
            size={resolvedIcon.size}
            strokeWidth={resolvedIcon.strokeWidth}
            color={resolvedIcon.color}
          />
        )
      )}
    </View>
  )
}

export type AvatarGroupProps = Omit<ViewProps, 'children' | 'style'> & {
  avatars: Omit<AvatarProps, 'size' | 'isGrouped' | 'groupIndex'>[],
  showTotalNumber?: boolean,
  size?: AvatarSize,
  ImageComponent?: ComponentType<AvatarImageProps>,
  style?: StyleProp<ViewStyle>,
  stackStyle?: StyleOverwrite<{ size?: ElementSize, count?: number }, AvatarGroupStackStyle>,
  moreStyle?: StyleOverwrite<{ size?: ElementSize, count?: number }, AvatarGroupMoreStyle>,
}

export const AvatarGroup = ({
  avatars,
  showTotalNumber = true,
  size = 'md',
  ImageComponent,
  style,
  stackStyle,
  moreStyle,
  ...props
}: AvatarGroupProps) => {
  const { theme } = useTheme()
  const maxShownProfiles = theme.layout.avatarGroup.maxShown
  const displayedProfiles = avatars.length < maxShownProfiles ? avatars : avatars.slice(0, maxShownProfiles)
  const notDisplayedProfiles = avatars.length - maxShownProfiles

  const state = useMemo(() => ({
    size,
    count: displayedProfiles.length,
  }), [size, displayedProfiles.length])

  const resolvedContainer = theme.components.avatar.group.container(state)
  const resolvedStack = theme.components.avatar.group.stack(state, stackStyle)
  const resolvedMore = theme.components.avatar.group.more(state, moreStyle)

  return (
    <View
      {...props}
      style={[resolvedContainer, style]}
    >
      <View style={resolvedStack}>
        {displayedProfiles.map((avatar, index) => (
          <Avatar
            {...avatar}
            key={index}
            size={size}
            isGrouped
            groupIndex={index}
            ImageComponent={avatar.ImageComponent ?? ImageComponent}
          />
        ))}
      </View>
      {showTotalNumber && notDisplayedProfiles > 0 && (
        <Text style={resolvedMore}>
          {`+ ${notDisplayedProfiles}`}
        </Text>
      )}
    </View>
  )
}

export type { AvatarStatus }

export type AvatarWithStatusProps = AvatarProps & {
  status?: AvatarStatus,
  containerStyle?: StyleOverwrite<{ size?: ElementSize, status?: AvatarStatus }, AvatarWithStatusContainerStyle>,
  statusDotStyle?: StyleOverwrite<{ size?: ElementSize, status?: AvatarStatus }, AvatarStatusDotStyle>,
}

export const AvatarWithStatus = ({
  status = 'unknown',
  size = 'md',
  style,
  containerStyle,
  statusDotStyle,
  ...avatarProps
}: AvatarWithStatusProps) => {
  const { theme } = useTheme()

  const state = useMemo(() => ({
    size,
    status,
  }), [size, status])

  const resolvedContainer = theme.components.avatar.withStatus.container(state, containerStyle)
  const resolvedStatusDot = theme.components.avatar.withStatus.statusDot(state, statusDotStyle)

  return (
    <View style={[resolvedContainer, style]}>
      <Avatar {...avatarProps} size={size} />
      <View style={resolvedStatusDot} />
    </View>
  )
}

type AvatarWithLabelPosition = 'left' | 'right'

export type AvatarWithLabelProps = AvatarProps & {
  label: ReactNode,
  labelPosition?: AvatarWithLabelPosition,
  containerStyle?: StyleOverwrite<{ size?: ElementSize }, AvatarWithLabelContainerStyle>,
  labelStyle?: StyleOverwrite<{ size?: ElementSize }, AvatarWithLabelTextStyle>,
}

export const AvatarWithLabel = ({
  label,
  labelPosition = 'left',
  size = 'md',
  style,
  containerStyle,
  labelStyle,
  ...avatarProps
}: AvatarWithLabelProps) => {
  const { theme } = useTheme()

  const state = useMemo(() => ({ size }), [size])
  const resolvedContainer = theme.components.avatar.withLabel.container(state, containerStyle)
  const resolvedLabel = theme.components.avatar.withLabel.text(state, labelStyle)

  const avatar = <Avatar {...avatarProps} size={size} />
  const labelElement = typeof label === 'string' || typeof label === 'number'
    ? <Text style={resolvedLabel}>{label}</Text>
    : label

  return (
    <View style={[resolvedContainer, style]}>
      {labelPosition === 'left' ? labelElement : avatar}
      {labelPosition === 'left' ? avatar : labelElement}
    </View>
  )
}
