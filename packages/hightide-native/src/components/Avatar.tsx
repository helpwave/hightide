import { useEffect, useMemo, useState } from 'react'
import type { ImageSourcePropType, ViewProps } from 'react-native'
import { Image, StyleSheet, View as RNView } from 'react-native'
import type { Theme } from '@helpwave/hightide-tokens'
import { useHightideTheme } from '../theme/ThemeContext'
import { Text } from '../primitives/Text'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg'

const dimensions: Record<AvatarSize, { size: number, fontSize: number }> = {
  xs: { size: 24, fontSize: 10 },
  sm: { size: 32, fontSize: 12 },
  md: { size: 40, fontSize: 16 },
  lg: { size: 56, fontSize: 20 },
}

const initialsFromName = (name: string | undefined, size: AvatarSize): string => {
  const maxLetters = size === 'xs' || size === 'sm' ? 1 : 2
  return (name ?? '')
    .split(' ')
    .filter((value) => value.length > 0)
    .slice(0, maxLetters)
    .map((value) => value[0])
    .join('')
    .toUpperCase()
}

const circle = (theme: Theme, size: AvatarSize) => ({
  width: dimensions[size].size,
  height: dimensions[size].size,
  borderRadius: dimensions[size].size / 2,
  backgroundColor: theme.colors.neutral,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  overflow: 'hidden' as const,
})

export type AvatarImage = {
  /** Remote URL or local `require(...)` source. */
  source: ImageSourcePropType,
  alt?: string,
}

export type AvatarProps = ViewProps & {
  image?: AvatarImage,
  name?: string,
  /** @default 'md' */
  size?: AvatarSize,
  className?: string,
}

/** A user avatar that shows an image, falling back to initials. */
export const Avatar = ({ image, name, size = 'md', style, ...props }: AvatarProps) => {
  const { theme } = useHightideTheme()
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setHasError(false)
  }, [image?.source])

  const initials = useMemo(() => initialsFromName(name, size), [name, size])
  const showImage = !!image && !hasError

  return (
    <RNView
      accessibilityRole="image"
      accessibilityLabel={image?.alt ?? name}
      style={[circle(theme, size), style]}
      {...props}
    >
      {showImage ? (
        <Image
          source={image!.source}
          onError={() => setHasError(true)}
          style={{ width: '100%', height: '100%' }}
          accessibilityLabel={image!.alt}
        />
      ) : (
        <Text style={{ color: theme.colors.onNeutral, fontSize: dimensions[size].fontSize, fontWeight: '600' }}>
          {initials}
        </Text>
      )}
    </RNView>
  )
}

export type AvatarGroupProps = ViewProps & {
  avatars: Omit<AvatarProps, 'size'>[],
  /** @default true */
  showTotalNumber?: boolean,
  /** @default 'md' */
  size?: AvatarSize,
  /** @default 5 */
  maxShown?: number,
  className?: string,
}

const groupStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
})

/** Overlapping row of {@link Avatar}s with an optional `+N` overflow badge. */
export const AvatarGroup = ({
  avatars,
  showTotalNumber = true,
  size = 'md',
  maxShown = 5,
  style,
  ...props
}: AvatarGroupProps) => {
  const { theme } = useHightideTheme()
  const shown = avatars.slice(0, maxShown)
  const overflow = avatars.length - shown.length
  const overlap = -Math.round(dimensions[size].size / 4)

  return (
    <RNView style={[groupStyles.row, style]} {...props}>
      {shown.map((avatar, index) => (
        <RNView
          key={index}
          style={{
            marginLeft: index === 0 ? 0 : overlap,
            borderRadius: dimensions[size].size / 2,
            borderWidth: 2,
            borderColor: theme.colors.surface,
          }}
        >
          <Avatar {...avatar} size={size} />
        </RNView>
      ))}
      {showTotalNumber && overflow > 0 && (
        <RNView style={[circle(theme, size), { marginLeft: overlap, borderWidth: 2, borderColor: theme.colors.surface }]}>
          <Text style={{ color: theme.colors.onNeutral, fontSize: dimensions[size].fontSize, fontWeight: '600' }}>
            {`+${overflow}`}
          </Text>
        </RNView>
      )}
    </RNView>
  )
}

export type AvatarStatus = 'online' | 'offline' | 'away' | 'busy' | 'unknown'

const statusColor = (theme: Theme, status: AvatarStatus): string => {
  switch (status) {
    case 'online': return theme.colors.positive
    case 'away': return theme.colors.warning
    case 'busy': return theme.colors.negative
    case 'offline': return theme.colors.disabled
    case 'unknown':
    default: return theme.colors.neutral
  }
}

export type AvatarWithStatusProps = AvatarProps & {
  /** @default 'unknown' */
  status?: AvatarStatus,
}

/** An {@link Avatar} with a presence dot in the bottom-right corner. */
export const AvatarWithStatus = ({ status = 'unknown', size = 'md', style, ...props }: AvatarWithStatusProps) => {
  const { theme } = useHightideTheme()
  const dotSize = Math.round(dimensions[size].size / 3)

  return (
    <RNView style={[{ position: 'relative' }, style]}>
      <Avatar {...props} size={size} />
      <RNView
        accessibilityLabel={`status: ${status}`}
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: dotSize,
          height: dotSize,
          borderRadius: dotSize / 2,
          backgroundColor: statusColor(theme, status),
          borderWidth: 2,
          borderColor: theme.colors.surface,
        }}
      />
    </RNView>
  )
}
