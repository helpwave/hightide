import type { ColorToken } from '../../primitive-tokens/color'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { TextStyleTokens } from '../text-style-tokens'
import {
  pillBorderRadius,
  resolveDescriptionColor,
  resolveFadedBorder,
  resolveHoverColor
} from './shared'

export type ChatQuickReplyChipState = {
  isPressed?: boolean,
  isDisabled?: boolean,
  isActive?: boolean,
}

export type ChatQuickReplyChipComponentResolverProps = {
  state: ChatQuickReplyChipState,
}

export type ChatQuickReplyChipTokens = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: number,
    paddingVertical: number,
    paddingHorizontal: number,
    borderRadius: number,
    borderWidth: number,
    borderColor: ColorToken,
    backgroundColor: ColorToken,
  },
  text: TextStyleTokens,
}

export type ChatQuickReplyChipTokenResolver = ComponentTokenResolver<
  ChatQuickReplyChipComponentResolverProps,
  ChatQuickReplyChipTokens
>

export const chatQuickReplyChipTokenResolver: ChatQuickReplyChipTokenResolver = ({ themeTokens, semanticResolvers, state }) => {
  const { color, spacing, shape, borders, typography } = themeTokens
  const descriptionColor = resolveDescriptionColor({ themeTokens, semanticResolvers })
  const fadedBorder = resolveFadedBorder({ themeTokens, semanticResolvers })
  const hoverColor = resolveHoverColor({ themeTokens, semanticResolvers })
  const isPressed = !!state.isPressed && !state.isDisabled
  const hairline = borders.borderWidths.thin

  return {
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: shape.padding.md,
      paddingVertical: shape.padding.md,
      paddingHorizontal: spacing.lg,
      borderRadius: pillBorderRadius,
      borderWidth: hairline,
      borderColor: state.isActive ? color.primary.color : fadedBorder,
      backgroundColor: isPressed ? hoverColor : color.surface.color,
    },
    text: {
      ...typography.body.sm,
      fontWeight: typography.fontWeights.medium,
      color: state.isActive ? color.primary.color : descriptionColor,
    },
  }
}
