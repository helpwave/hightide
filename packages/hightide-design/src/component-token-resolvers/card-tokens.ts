import type { ColorToken } from '../primitive-tokens/color'
import { resolveColorPairColoring } from './coloring'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { TextStyleTokens } from './text-style-tokens'

export type CardState = {
  isPressed?: boolean,
  isDisabled?: boolean,
  isDanger?: boolean,
}

export type CardComponentResolverProps = {
  state: CardState,
}

export type CardContainerTokens = {
  backgroundColor: ColorToken,
  borderColor: ColorToken,
  borderWidth: number,
  borderRadius: number,
  overflow: 'hidden',
}

export type CardItemTokens = {
  flexDirection: 'row',
  alignItems: 'center',
  minHeight: number,
  paddingVertical: number,
  paddingHorizontal: number,
  borderBottomWidth: number,
  borderBottomColor: ColorToken,
  gap: number,
}

export type CardActionItemTokens = CardItemTokens & {
  backgroundColor: ColorToken,
  opacity: number,
}

export type CardItemContentTokens = {
  flex: number,
  gap: number,
  justifyContent: 'center',
}

export type CardIconTokens = {
  color: ColorToken,
}

export type CardTokens = {
  container: CardContainerTokens,
  item: CardItemTokens,
  itemContent: CardItemContentTokens,
  itemLabel: TextStyleTokens,
  itemValue: TextStyleTokens,
  actionItem: CardActionItemTokens,
  actionItemContent: CardItemContentTokens,
  actionItemLabel: TextStyleTokens,
  actionItemIcon: CardIconTokens,
  navigationItem: CardActionItemTokens,
  navigationItemContent: CardItemContentTokens,
  navigationItemLabel: TextStyleTokens,
  navigationItemIcon: CardIconTokens,
  navigationItemTrailing: CardIconTokens,
}

export type CardTokenResolver = ComponentTokenResolver<
  CardComponentResolverProps,
  CardTokens
>

export const cardTokenResolver: CardTokenResolver = ({ themeTokens, semanticResolvers, state }) => {
  const { color, size, spacing, shape, borders, typography } = themeTokens
  const descriptionColor = semanticResolvers.asDescription({
    themeTokens,
    semanticResolvers,
    color: color.surface.onColor,
  })
  const fadedBorder = semanticResolvers.asFaded({
    themeTokens,
    semanticResolvers,
    color: color.surface.onColor,
  })
  const isPressed = !!state.isPressed && !state.isDisabled
  const hoverColor = resolveColorPairColoring({
    themeTokens,
    semanticResolvers,
    colorPair: themeTokens.color.surface,
    style: 'filled',
    state: { isHovered: true },
  }).color

  const item: CardItemTokens = {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: size.xl + spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: borders.borderWidths.thin,
    borderBottomColor: fadedBorder,
    gap: shape.padding.xxl,
  }

  const itemContent: CardItemContentTokens = {
    flex: 1,
    gap: spacing.sm,
    justifyContent: 'center',
  }

  const actionItem: CardActionItemTokens = {
    ...item,
    backgroundColor: isPressed ? hoverColor : 'transparent',
    opacity: state.isDisabled ? 0.6 : 1,
  }

  const actionItemLabel: TextStyleTokens = {
    ...typography.body.md,
    fontWeight: typography.fontWeights.medium,
    color: state.isDanger ? color.negative.color : color.surface.onColor,
  }

  const actionItemIcon: CardIconTokens = {
    color: state.isDanger ? color.negative.color : color.primary.color,
  }

  return {
    container: {
      backgroundColor: color.surfaceVariant.color,
      borderColor: fadedBorder,
      borderWidth: borders.borderWidths.thin,
      borderRadius: shape.borderRadius.lg,
      overflow: 'hidden',
    },
    item,
    itemContent,
    itemLabel: {
      ...typography.body.sm,
      color: descriptionColor,
    },
    itemValue: {
      ...typography.body.md,
      fontWeight: typography.fontWeights.medium,
      color: color.surface.onColor,
    },
    actionItem,
    actionItemContent: itemContent,
    actionItemLabel,
    actionItemIcon,
    navigationItem: actionItem,
    navigationItemContent: itemContent,
    navigationItemLabel: actionItemLabel,
    navigationItemIcon: actionItemIcon,
    navigationItemTrailing: {
      color: descriptionColor,
    },
  }
}
