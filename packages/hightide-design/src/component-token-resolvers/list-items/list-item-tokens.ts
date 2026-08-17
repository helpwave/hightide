import type { ColorPairToken } from '../../theme-tokens/theme-tokens-config'
import {
  resolveColoringColorVariant,
  resolveColoringStyle
} from '../../semantic-token-resolvers'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import type { IconTokens } from '../icon-tokens'
import type { TextStyleTokens } from '../text-style-tokens'

export type ListItemComponentResolverProps = {
  overrides?: {
    color?: ColorPairToken,
  },
}

export type ListItemTokens = {
  container: ContainerTokens,
  leadingItemContainer: ContainerTokens,
  content: ContainerTokens,
  trailingItemContainer: ContainerTokens,
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
  const { color, spacing, typography, icongraphy } = themeTokens
  const descriptionColor = semanticResolvers.asDescription({
    themeTokens,
    color: color.surface.onColor,
  })
  const layout = semanticResolvers.controlLayout({ themeTokens, size: 'md' })
  const largeControl = semanticResolvers.controlLayout({ themeTokens, size: 'lg' })

  const tonal = overrides?.color !== undefined
    ? resolveColoringStyle({
      themeTokens,
      coloring: resolveColoringColorVariant({
        themeTokens,
        colorPair: overrides.color,
        variant: 'tonal',
      }),
      style: 'filled',
    })
    : undefined

  const titleColor = tonal?.foreground ?? color.surface.onColor
  const descriptionTextColor = tonal?.foreground ?? descriptionColor
  const iconColor = titleColor

  return {
    container: {
      backgroundColor: tonal?.background,
      size: {
        width: '100%',
        minWidth: layout.size,
        minHeight: layout.size,
      },
      padding: {
        type: 'physicalAxis',
        vertical: largeControl.inset,
        horizontal: layout.horizontalContentPadding,
      },
      layout: {
        direction: 'horizontal',
        mainAxisAlignment: 'start',
        crossAxisAligment: 'center',
      },
    },
    leadingItemContainer: {
      margin: {
        type: 'logicalSide',
        inlineEnd: spacing.md,
      },
      layout: {
        direction: 'horizontal',
        crossAxisAligment: 'center',
      },
    },
    content: {
      size: {
        width: '100%'
      },
      layout: {
        gap: spacing.xs,
        direction: 'vertical',
        mainAxisAlignment: 'center',
        crossAxisAligment: 'start',
      },
    },
    trailingItemContainer: {
      margin: {
        type: 'logicalSide',
        inlineStart: spacing.xl,
      },
      layout: {
        direction: 'horizontal',
        crossAxisAligment: 'center',
      },
    },
    icon: {
      size: icongraphy.sizes.md,
      strokeWidth: icongraphy.strokeWidth,
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
