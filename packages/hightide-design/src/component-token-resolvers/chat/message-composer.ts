import type { ColorToken } from '../../primitive-tokens/color'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { TextStyleTokens } from '../text-style-tokens'
import {
  composerMaxLines,
  resolveDescriptionColor,
  resolveFadedBorder
} from './shared'

export type ChatMessageComposerTokens = {
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
    gap: number,
    paddingVertical: number,
    paddingHorizontal: number,
    backgroundColor: ColorToken,
    borderTopWidth: number,
    borderTopColor: ColorToken,
  },
  input: TextStyleTokens & {
    flex: number,
    minHeight: number,
    maxHeight: number,
    paddingVertical: number,
    paddingHorizontal: number,
    borderRadius: number,
    backgroundColor: ColorToken,
  },
  placeholderColor: ColorToken,
}

export const hightideChatMessageComposerTokenResolver: ComponentTokenResolver<
  {},
  ChatMessageComposerTokens
> = ({ themeTokens, semanticResolvers }) => {
  const { color, size, spacing, shape, borders, typography } = themeTokens
  const placeholderColor = resolveDescriptionColor({ themeTokens, semanticResolvers })
  const fadedBorder = resolveFadedBorder({ themeTokens, semanticResolvers })

  return {
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      width: '100%',
      gap: spacing.md,
      paddingVertical: shape.padding.xxl,
      paddingHorizontal: spacing.lg,
      backgroundColor: color.surface.color,
      borderTopWidth: borders.borderWidths.thin,
      borderTopColor: fadedBorder,
    },
    input: {
      ...typography.body.md,
      flex: 1,
      minHeight: size.md,
      maxHeight: size.md * composerMaxLines,
      paddingVertical: shape.padding.xxl,
      paddingHorizontal: shape.padding.xxl,
      borderRadius: shape.borderRadius.sm,
      backgroundColor: color.surfaceVariant.color,
      color: color.surface.onColor,
    },
    placeholderColor,
  }
}
