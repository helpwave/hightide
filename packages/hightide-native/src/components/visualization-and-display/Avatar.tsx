import {
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type ReactNode
} from 'react'
import {
  Image,
  View,
  type ImageProps,
  type StyleProp,
  type ViewProps,
  type ViewStyle
} from 'react-native'
import { HightideIconRegistry } from '../../icons/HightideIconRegistry'
import { ThemedIcon } from './ThemedIcon'
import { ThemedText } from './ThemedText'
import {
  avatarSizes,
  type AvatarSize as AvatarSizeToken
} from '@helpwave/hightide-design/component-token-resolvers'
import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'

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
import { avatarStatuses } from '../../theme/types/components/avatar'
import type { StyleOverwrite } from '../../theme/types/resolver'

export type AvatarSize = AvatarSizeToken | number

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
  sizes: avatarSizes,
  statuses: avatarStatuses,
}

export type AvatarProps = Omit<ViewProps, 'children' | 'style'> & {
  image?: ImageConfig,
  name?: string,
  size?: AvatarSize,
  color?: ColorPairToken,
  ImageComponent?: ComponentType<AvatarImageProps>,
  style?: StyleProp<ViewStyle>,
  avatarStyle?: StyleOverwrite<{ size?: AvatarSize, isGrouped?: boolean, groupIndex?: number, color?: ColorPairToken }, AvatarStyle>,
  imageStyle?: StyleOverwrite<{ size?: AvatarSize, isGrouped?: boolean, groupIndex?: number, color?: ColorPairToken }, AvatarImageStyle>,
  textStyle?: StyleOverwrite<{ size?: AvatarSize, isGrouped?: boolean, groupIndex?: number, color?: ColorPairToken }, AvatarTextStyle>,
  iconStyle?: StyleOverwrite<{ size?: AvatarSize, isGrouped?: boolean, groupIndex?: number, color?: ColorPairToken }, AvatarIconStyle>,
  isGrouped?: boolean,
  groupIndex?: number,
}

export const Avatar = ({
  image: initialImage,
  name,
  size = 'md',
  color,
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
    color,
  }), [size, isGrouped, groupIndex, color])

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

  const resolvedAvatar = theme.components.avatar.container(state, avatarStyle)
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
          <ThemedText style={resolvedText}>{displayName}</ThemedText>
        ) : (
          <ThemedIcon
            icon={HightideIconRegistry.User}
            size={resolvedIcon.size}
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
  stackStyle?: StyleOverwrite<{ size?: AvatarSize, count?: number }, AvatarGroupStackStyle>,
  moreStyle?: StyleOverwrite<{ size?: AvatarSize, count?: number }, AvatarGroupMoreStyle>,
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
  const maxShownProfiles = 5
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
        <ThemedText style={resolvedMore}>
          {`+ ${notDisplayedProfiles}`}
        </ThemedText>
      )}
    </View>
  )
}

export type { AvatarStatus }

export type AvatarWithStatusProps = AvatarProps & {
  status?: AvatarStatus,
  containerStyle?: StyleOverwrite<{ size?: AvatarSize, status?: AvatarStatus }, AvatarWithStatusContainerStyle>,
  statusDotStyle?: StyleOverwrite<{ size?: AvatarSize, status?: AvatarStatus }, AvatarStatusDotStyle>,
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
  containerStyle?: StyleOverwrite<{ size?: AvatarSize }, AvatarWithLabelContainerStyle>,
  labelStyle?: StyleOverwrite<{ size?: AvatarSize }, AvatarWithLabelTextStyle>,
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
    ? <ThemedText style={resolvedLabel}>{label}</ThemedText>
    : label

  return (
    <View style={[resolvedContainer, style]}>
      {labelPosition === 'left' ? labelElement : avatar}
      {labelPosition === 'left' ? avatar : labelElement}
    </View>
  )
}
