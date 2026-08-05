import type { ColorToken } from '../../primitive-tokens/color'
import type { ComponentTokenResolver } from '../component-token-resolver'

export type ChatConversationListTokens = {
  container: {
    flex: number,
    backgroundColor: ColorToken,
  },
  header: {
    paddingVertical: number,
    paddingHorizontal: number,
    gap: number,
  },
  footer: {
    paddingVertical: number,
    paddingHorizontal: number,
  },
}

export const hightideChatConversationListTokenResolver: ComponentTokenResolver<
  {},
  ChatConversationListTokens
> = ({ themeTokens }) => {
  const { color, spacing, shape } = themeTokens

  return {
    container: {
      flex: 1,
      backgroundColor: color.surface.color,
    },
    header: {
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.lg,
      gap: shape.padding.xxl,
    },
    footer: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    },
  }
}
