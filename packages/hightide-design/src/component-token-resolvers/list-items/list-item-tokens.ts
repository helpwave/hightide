import type { ColorPairToken } from '../../theme-tokens/theme-tokens-config'
import { resolveColorPairColoring } from '../coloring'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import { createIconSizeTokens, type IconTokens } from '../icon-tokens'
import type { TextStyleTokens } from '../text-style-tokens'

export type ListItemComponentResolverProps = {
  overrides?: {
    color?: ColorPairToken,
  },
}

export type ListItemTokens = {
  container: ContainerTokens,
  content: ContainerTokens,
  icon: IconTokens,
  titleText: TextStyleTokens,
  descriptionText: TextStyleTokens,
}

export type ListItemTokenResolver = ComponentTokenResolver<
  ListItemComponentResolverProps,
  ListItemTokens
>

export const listItemTokenResolver: ListItemTokenResolver = ({
  themeTokens,
  semanticResolvers,
  overrides,
}) => {
  const { color, size, spacing, typography } = themeTokens
  const iconSizeTokens = createIconSizeTokens(themeTokens).md
  const descriptionColor = semanticResolvers.asDescription({
    themeTokens,
    semanticResolvers,
    color: color.surface.onColor,
  })

  const tonal = overrides?.color !== undefined
    ? resolveColorPairColoring({
      themeTokens,
      semanticResolvers,
      colorPair: overrides.color,
      style: 'tonal',
    })
    : undefined

  const titleColor = tonal?.onColor ?? color.surface.onColor
  const descriptionTextColor = tonal?.onColor ?? descriptionColor
  const iconColor = tonal?.onColor ?? color.primary.color

  return {
    container: {
      backgroundColor: tonal?.color,
      size: {
        width: '100%',
        minHeight: size.xl + spacing.sm,
      },
      shape: {
        padding: {
          vertical: spacing.md,
          horizontal: spacing.lg,
        },
      },
      layout: {
        gap: spacing.md,
        direction: 'horizontal',
        mainAxisAlignment: 'start',
        crossAxisAligment: 'center',
      },
    },
    content: {
      size: {
        width: '100%'
      },
      layout: {
        gap: spacing.sm,
        direction: 'vertical',
        mainAxisAlignment: 'center',
        crossAxisAligment: 'start',
      },
    },
    icon: {
      size: iconSizeTokens.size,
      strokeWidth: iconSizeTokens.strokeWidth,
      color: iconColor,
    },
    titleText: {
      ...typography.body.md,
      color: titleColor,
    },
    descriptionText: {
      ...typography.body.sm,
      color: descriptionTextColor,
    },
  }
}
