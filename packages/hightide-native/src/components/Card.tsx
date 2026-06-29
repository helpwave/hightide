import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import type { PressableProps, PressableStateCallbackType, View, ViewProps } from 'react-native'
import { Pressable, StyleSheet, View as RNView } from 'react-native'
import type { Theme, TypographyVariantName } from '@helpwave/hightide-tokens'
import { space } from '@helpwave/hightide-tokens'
import { useHightideTheme } from '../theme/ThemeContext'
import { Text } from '../primitives/Text'

export type CardSize = 'sm' | 'md' | 'lg'

type CardGeometry = {
  paddingHorizontal: number,
  paddingVertical: number,
  borderRadius: number,
  titleVariant: TypographyVariantName,
}

const geometryFor = (theme: Theme, size: CardSize): CardGeometry => {
  switch (size) {
    case 'sm':
      return { paddingHorizontal: space(2), paddingVertical: space(1), borderRadius: theme.radii.sm, titleVariant: 'titleSm' }
    case 'lg':
      return { paddingHorizontal: space(8), paddingVertical: space(4), borderRadius: theme.radii.lg, titleVariant: 'titleLg' }
    case 'md':
    default:
      return { paddingHorizontal: space(4), paddingVertical: space(2), borderRadius: theme.radii.md, titleVariant: 'titleMd' }
  }
}

type CardHeaderProps = {
  title?: ReactNode,
  description?: ReactNode,
  leading?: ReactNode,
  trailing?: ReactNode,
  titleVariant: TypographyVariantName,
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: space(4),
    width: '100%',
  },
  headerContent: {
    flex: 1,
    minWidth: 0,
    rowGap: space(1),
  },
  edge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    rowGap: space(1),
  },
})

const CardHeader = ({ title, description, leading, trailing, titleVariant }: CardHeaderProps) => {
  if (title == null && description == null && leading == null && trailing == null) {
    return null
  }
  return (
    <RNView style={styles.header}>
      {leading != null && <RNView style={styles.edge}>{leading}</RNView>}
      <RNView style={styles.headerContent}>
        {typeof title === 'string' ? <Text variant={titleVariant}>{title}</Text> : title}
        {description != null
          && (typeof description === 'string'
            ? <Text variant="captionSm" color="description">{description}</Text>
            : description)}
      </RNView>
      {trailing != null && <RNView style={styles.edge}>{trailing}</RNView>}
    </RNView>
  )
}

const useCardSurface = (size: CardSize) => {
  const { theme } = useHightideTheme()
  const geometry = geometryFor(theme, size)
  return {
    theme,
    geometry,
    surface: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: geometry.paddingHorizontal,
      paddingVertical: geometry.paddingVertical,
      borderRadius: geometry.borderRadius,
      width: '100%' as const,
      rowGap: space(1),
      ...theme.elevation.md.native,
    },
  }
}

export type CardProps = ViewProps & {
  title?: ReactNode,
  description?: ReactNode,
  leading?: ReactNode,
  trailing?: ReactNode,
  /** @default 'md' */
  size?: CardSize,
  children?: ReactNode,
  className?: string,
}

/** A surface that groups related content, with an optional header. */
export const Card = forwardRef<View, CardProps>(function Card({
  title,
  description,
  leading,
  trailing,
  size = 'md',
  children,
  style,
  ...props
}, ref) {
  const { geometry, surface } = useCardSurface(size)
  return (
    <RNView ref={ref} style={[surface, style]} {...props}>
      <CardHeader
        title={title}
        description={description}
        leading={leading}
        trailing={trailing}
        titleVariant={geometry.titleVariant}
      />
      {children != null && <RNView style={styles.body}>{children}</RNView>}
    </RNView>
  )
})

export type ActionCardProps = Omit<PressableProps, 'children' | 'style'> & {
  title?: ReactNode,
  description?: ReactNode,
  leading?: ReactNode,
  trailing?: ReactNode,
  /** @default 'md' */
  size?: CardSize,
  disabled?: boolean,
  children?: ReactNode,
  className?: string,
  style?: PressableProps['style'],
}

/** A pressable {@link Card}. Highlights on press, matching the web action card. */
export const ActionCard = forwardRef<View, ActionCardProps>(function ActionCard({
  title,
  description,
  leading,
  trailing,
  size = 'md',
  disabled = false,
  children,
  style,
  ...props
}, ref) {
  const { theme, geometry, surface } = useCardSurface(size)
  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      style={(state: PressableStateCallbackType) => [
        surface,
        state.pressed && { backgroundColor: theme.colors.surfaceHover },
        disabled && { opacity: 0.6 },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...props}
    >
      <CardHeader
        title={title}
        description={description}
        leading={leading}
        trailing={trailing}
        titleVariant={geometry.titleVariant}
      />
      {children != null && <RNView style={styles.body}>{children}</RNView>}
    </Pressable>
  )
})
