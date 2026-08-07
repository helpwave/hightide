import type { ColorPairToken } from '../../theme-tokens/theme-tokens-config'
import { resolveColoringStyle } from '../../semantic-token-resolvers'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import { iconTokenResolver, type IconTokens } from '../icon-tokens'
import type { TextStyleTokens } from '../text-style-tokens'

export type ListPositionToken = 'first' | 'middle' | 'last'

export type ListItemAppearance = 'listItem' | 'independent'

export type ListItemState = {
  position?: ListPositionToken,
}

export type ListItemConfig = {
  appearance?: ListItemAppearance,
}

export type ListItemComponentResolverProps = {
  overrides?: {
    color?: ColorPairToken,
  },
  config?: ListItemConfig,
  state?: ListItemState,
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
  config,
  state,
}) => {
  const { color, spacing, typography, borders } = themeTokens
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
  const appearance = config?.appearance ?? 'listItem'
  const position = state?.position ?? 'middle'
  const isIndependent = appearance === 'independent'
  const showSeparator = appearance === 'listItem' && position !== 'last'

  const tonal = overrides?.color !== undefined
    ? resolveColoringStyle({
      themeTokens,
      colorPair: overrides.color,
      style: 'tonal',
    })
    : undefined

  const titleColor = tonal?.text ?? color.surface.onColor
  const descriptionTextColor = tonal?.text ?? descriptionColor
  const iconColor = tonal?.text ?? color.primary.color

  return {
    container: {
      backgroundColor: tonal?.background,
      size: {
        width: '100%',
        minWidth: layout.size,
        minHeight: layout.size,
      },
      shape: {
        borderRadius: isIndependent ? layout.borderRadius : undefined,
        padding: {
          vertical: largeControl.inset,
          horizontal: layout.horizontalContentPadding,
        },
      },
      border: showSeparator ? {
        width: {
          type: 'physicalSide',
          bottom: borders.borderWidths.thin,
        },
        color: {
          type: 'physicalSide',
          bottom: color.border,
        },
      } : undefined,
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
