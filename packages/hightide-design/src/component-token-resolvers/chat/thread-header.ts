import type { ColorToken } from '../../primitive-tokens/color'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { TextStyleTokens } from '../text-style-tokens'
import {
  resolveDescriptionColor,
  resolveFadedBorder
} from './shared'

export type ChatThreadHeaderTokens = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: number,
    paddingVertical: number,
    paddingHorizontal: number,
    borderBottomWidth: number,
    borderBottomColor: ColorToken,
    backgroundColor: ColorToken,
  },
  title: TextStyleTokens,
  subtitle: TextStyleTokens,
}

export type ChatThreadHeaderTokenResolver = ComponentTokenResolver<
  Record<string, never>,
  ChatThreadHeaderTokens
>

export const chatThreadHeaderTokenResolver: ChatThreadHeaderTokenResolver = ({ themeTokens, semanticResolvers }) => {
  const { color, spacing, shape, borders, typography } = themeTokens
  const descriptionColor = resolveDescriptionColor({ themeTokens, semanticResolvers })
  const fadedBorder = resolveFadedBorder({ themeTokens, semanticResolvers })

  return {
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: shape.padding.xxl,
      paddingVertical: shape.padding.xxl,
      paddingHorizontal: spacing.lg,
      borderBottomWidth: borders.borderWidths.thin,
      borderBottomColor: fadedBorder,
      backgroundColor: color.surface.color,
    },
    title: {
      ...typography.body.md,
      fontWeight: typography.fontWeights.bold,
      color: color.surface.onColor,
    },
    subtitle: {
      ...typography.body.sm,
      fontWeight: typography.fontWeights.light,
      color: descriptionColor,
    },
  }
}
