import {
  useEffect,
  useMemo,
  useState,
  type ComponentType
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
import { useMemoizedTheme, useMemoizedThemeFactory } from '../../hooks/useMemoizedTheme'
import type {
  AvatarGroupContainerStyle,
  AvatarGroupStackStyle,
  AvatarGroupTextStyle,
  AvatarImageStyle,
  AvatarIconStyle,
  AvatarState,
  AvatarStatus,
  AvatarStyle,
  AvatarTextStyle,
  AvatarThemeResolvers,
  AvatarStatusDotStyle,
  AvatarWithStatusState
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
  avatarStyle?: StyleOverwrite<AvatarState, AvatarStyle>,
  imageStyle?: StyleOverwrite<AvatarState, AvatarImageStyle>,
  textStyle?: StyleOverwrite<AvatarState, AvatarTextStyle>,
  iconStyle?: StyleOverwrite<AvatarState, AvatarIconStyle>,
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

  const state = useMemo((): AvatarState => ({
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

  const resolvedAvatar = useMemoizedTheme(theme.components.avatar.container, state, avatarStyle)
  const resolvedImage = useMemoizedTheme(theme.components.avatar.image, state, imageStyle)
  const resolvedText = useMemoizedTheme(theme.components.avatar.text, state, textStyle)
  const resolvedIcon = useMemoizedTheme(theme.components.avatar.icon, state, iconStyle)

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
  color?: ColorPairToken,
  ImageComponent?: ComponentType<AvatarImageProps>,
  style?: StyleProp<ViewStyle>,
  containerStyle?: StyleOverwrite<{ size?: AvatarSize, count?: number }, AvatarGroupContainerStyle>,
  avatarStackStyle?: StyleOverwrite<{ size?: AvatarSize, count?: number }, AvatarGroupStackStyle>,
  textStyle?: StyleOverwrite<{ size?: AvatarSize, count?: number }, AvatarGroupTextStyle>,
}

export const AvatarGroup = ({
  avatars,
  showTotalNumber = true,
  size = 'md',
  color,
  ImageComponent,
  style,
  containerStyle,
  avatarStackStyle,
  textStyle,
  ...props
}: AvatarGroupProps) => {
  const { theme } = useTheme()
  const maxShownProfiles = 5
  const displayedProfiles = avatars.length < maxShownProfiles ? avatars : avatars.slice(0, maxShownProfiles)
  const notDisplayedProfiles = avatars.length - maxShownProfiles

  const state = useMemo(() => ({
    size,
    color,
    count: displayedProfiles.length,
  }), [size, color, displayedProfiles.length])

  const avatarResolvers = useMemoizedThemeFactory<
    AvatarState,
    AvatarThemeResolvers
  >(theme.components.avatarGroup.avatar, state)
  const resolvedContainer = useMemoizedTheme(theme.components.avatarGroup.container, state, containerStyle)
  const resolvedAvatarStack = useMemoizedTheme(theme.components.avatarGroup.avatarStack, state, avatarStackStyle)
  const resolvedText = useMemoizedTheme(theme.components.avatarGroup.text, state, textStyle)

  return (
    <View
      {...props}
      style={[resolvedContainer, style]}
    >
      <View style={resolvedAvatarStack}>
        {displayedProfiles.map((avatar, index) => {
          const avatarState: AvatarState = {
            size,
            isGrouped: true,
            groupIndex: index,
            color: avatar.color ?? color,
          }

          return (
            <Avatar
              {...avatar}
              key={index}
              size={size}
              isGrouped
              groupIndex={index}
              ImageComponent={avatar.ImageComponent ?? ImageComponent}
              avatarStyle={(state) => avatarResolvers.container({
                ...state,
                ...avatarState,
              })}
              imageStyle={(state) => avatarResolvers.image({
                ...state,
                ...avatarState,
              })}
              textStyle={(state) => avatarResolvers.text({
                ...state,
                ...avatarState,
              })}
              iconStyle={(state) => avatarResolvers.icon({
                ...state,
                ...avatarState,
              })}
            />
          )
        })}
      </View>
      {showTotalNumber && notDisplayedProfiles > 0 && (
        <ThemedText style={resolvedText}>
          {`+${notDisplayedProfiles}`}
        </ThemedText>
      )}
    </View>
  )
}

export type { AvatarStatus }

export type AvatarWithStatusProps = AvatarProps & {
  status?: AvatarStatus,
  statusDotStyle?: StyleOverwrite<AvatarWithStatusState, AvatarStatusDotStyle>,
}

export const AvatarWithStatus = ({
  status = 'unknown',
  size = 'md',
  color,
  style,
  avatarStyle,
  imageStyle,
  textStyle,
  iconStyle,
  statusDotStyle,
  ...avatarProps
}: AvatarWithStatusProps) => {
  const { theme } = useTheme()

  const state = useMemo((): AvatarWithStatusState => ({
    size,
    color,
    status,
  }), [size, color, status])

  const avatarResolvers = useMemoizedThemeFactory<
    AvatarWithStatusState,
    AvatarThemeResolvers
  >(theme.components.avatarWithStatus.avatar, state)
  const resolvedStatusDot = useMemoizedTheme(theme.components.avatarWithStatus.statusDot, state, statusDotStyle)

  return (
    <View style={[{ position: 'relative' }, style]}>
      <Avatar
        {...avatarProps}
        size={size}
        color={color}
        avatarStyle={(state) => avatarResolvers.container(state, avatarStyle)}
        imageStyle={(state) => avatarResolvers.image(state, imageStyle)}
        textStyle={(state) => avatarResolvers.text(state, textStyle)}
        iconStyle={(state) => avatarResolvers.icon(state, iconStyle)}
      />
      <View style={resolvedStatusDot} />
    </View>
  )
}
