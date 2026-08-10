import type { ColorPairToken } from '../../theme-tokens/theme-tokens-config'
import {
  resolveColoringColorVariant,
  resolveColoringStyle
} from '../../semantic-token-resolvers'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import { iconTokenResolver, type IconTokens } from '../icon-tokens'
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
  const { color, spacing, typography } = themeTokens
  const iconSizeTokens = iconTokenResolver({
    themeTokens,
    semanticResolvers,
    overrides: { size: 'md' },
  })
  const descriptionColor = semanticResolvers.asDescription({
    themeTokens,
    color: color.surface.onColor,
  })
  const layout = semanticResolvers.controlLayout({ themeTokens, size: 'md' })
  const largeControl = semanticResolvers.controlLayout({ themeTokens, size: 'lg' })

  const tonal = overrides?.color !== undefined
    ? resolveColoringStyle({
      coloring: resolveColoringColorVariant({
        colorPair: overrides.color,
        variant: 'tonal',
      }),
      style: 'filled',
    })
    : undefined

  const titleColor = tonal?.foreground ?? color.surface.onColor
  const descriptionTextColor = tonal?.foreground ?? descriptionColor
  const iconColor = tonal?.foreground ?? color.primary.color

  return {
    container: {
      backgroundColor: tonal?.background,
      size: {
        width: '100%',
        minWidth: layout.size,
        minHeight: layout.size,
      },
      shape: {
        padding: {
          vertical: largeControl.inset,
          horizontal: layout.horizontalContentPadding,
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
