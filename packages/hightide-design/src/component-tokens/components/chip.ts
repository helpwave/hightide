import type { HightideSemanticTokens } from '../../semantic-tokens/semanticTokens'
import type { ComponentSize } from '../../theme-tokens/layout'
import { componentSizes } from '../../theme-tokens/layout'

export type ChipLayoutToken = {
  size: number,
  inset: number,
  border: number,
  radius: number,
  gap: number,
  horizontalInset: number,
  minWidth: number,
  fontSize: number,
}

export type HightideChipTokens = {
  layout: Record<ComponentSize, ChipLayoutToken>,
}

const chipRadiusKeyFor = (size: ComponentSize): 'xs' | 'sm' | 'md' => {
  if (size === 'xl' || size === 'lg') {
    return 'md'
  }
  return size
}

export const toChipTokens = (
  semanticTokens: HightideSemanticTokens
): HightideChipTokens => {
  const control = semanticTokens.elementLayout.control

  const layout = Object.fromEntries(
    componentSizes.map((size) => {
      const token = control[size]
      const gap = size === 'xs' || size === 'sm' ? semanticTokens.spacing.xs : semanticTokens.spacing.sm
      const sizeValue = token.size
      const inset = token.inset
      const horizontalInset = token.horizontalContentPadding ?? token.inset

      return [size, {
        size: Math.max(sizeValue - semanticTokens.spacing.xs, 24),
        inset: Math.max(Math.round(inset * 0.5), 3),
        border: token.border,
        radius: semanticTokens.radius[chipRadiusKeyFor(size)],
        gap,
        horizontalInset: Math.max(Math.round(horizontalInset * 0.8), semanticTokens.spacing.xs),
        minWidth: token.minimumWidth ?? token.size,
        fontSize: Number(semanticTokens.typography.scales.label.medium.fontSize),
      } satisfies ChipLayoutToken]
    })
  ) as Record<ComponentSize, ChipLayoutToken>

  return { layout }
}
