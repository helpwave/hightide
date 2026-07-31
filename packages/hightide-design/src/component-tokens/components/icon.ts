import type { HightideSemanticTokens } from '../../semantic-tokens/semanticTokens'
import type { ComponentSize } from '../../theme-tokens/layout'
import { componentSizes } from '../../theme-tokens/layout'

export type HightideIconTokens = Record<ComponentSize, {
  size: number,
  strokeWidth: number,
}>

export const toIconTokens = (
  semanticTokens: HightideSemanticTokens
): HightideIconTokens => (
  Object.fromEntries(
    componentSizes.map((size) => [size, {
      size: semanticTokens.elementLayout.insideControl[size].size - 2 * semanticTokens.spacing.xs,
      strokeWidth: semanticTokens.borderWidth.normal,
    }])
  ) as HightideIconTokens
)
