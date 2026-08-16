import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import type { TextStyleTokens } from '../text-style-tokens'
import {
  pillBorderRadius,
  resolveDescriptionColor
} from './shared'

export type ChatDateDividerTokens = {
  container: ContainerTokens,
  text: TextStyleTokens,
}

export type ChatDateDividerTokenResolver = ComponentTokenResolver<
  Record<string, unknown>,
  ChatDateDividerTokens
>

export const chatDateDividerTokenResolver: ChatDateDividerTokenResolver = ({ themeTokens, semanticResolvers }) => {
  const { color, spacing, typography } = themeTokens
  const descriptionColor = resolveDescriptionColor({ themeTokens, semanticResolvers })

  return {
    container: {
      backgroundColor: color.surface.color,
      shape: {
        borderRadius: { type: 'all', value: pillBorderRadius },
      },
      padding: {
        type: 'physicalAxis',
        vertical: spacing.sm,
        horizontal: spacing.lg,
      },
      layout: {
        alignSelf: 'center',
      },
    },
    text: {
      ...typography.body.sm,
      fontWeight: typography.fontWeights.medium,
      color: descriptionColor,
    },
  }
}
