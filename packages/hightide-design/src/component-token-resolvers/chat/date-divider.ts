import type { ColorToken } from '../../primitive-tokens/color'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { TextStyleTokens } from '../text-style-tokens'
import {
  pillBorderRadius,
  resolveDescriptionColor
} from './shared'

export type ChatDateDividerTokens = {
  container: {
    alignSelf: 'center',
    paddingVertical: number,
    paddingHorizontal: number,
    borderRadius: number,
    backgroundColor: ColorToken,
  },
  text: TextStyleTokens,
}

export const hightideChatDateDividerTokenResolver: ComponentTokenResolver<
  {},
  ChatDateDividerTokens
> = ({ themeTokens, semanticResolvers }) => {
  const { color, spacing, typography } = themeTokens
  const descriptionColor = resolveDescriptionColor({ themeTokens, semanticResolvers })

  return {
    container: {
      alignSelf: 'center',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      borderRadius: pillBorderRadius,
      backgroundColor: color.surface.color,
    },
    text: {
      ...typography.body.sm,
      fontWeight: typography.fontWeights.medium,
      color: descriptionColor,
    },
  }
}
