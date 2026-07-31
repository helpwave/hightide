import type { HightideSemanticTokens } from '../../semantic-tokens/semanticTokens'
import type { ComponentSizeBasic } from '../../theme-tokens/layout'
import { componentSizesBasic } from '../../theme-tokens/layout'

export type HightideIconTokens = Record<ComponentSizeBasic, {
  size: number,
  strokeWidth: number,
}>

export const toIconTokens = (
  semanticTokens: HightideSemanticTokens
): HightideIconTokens => (
  Object.fromEntries(
    componentSizesBasic.map((size) => [size, {
      size: semanticTokens.elementLayout.insideControl[size].size - 2 * semanticTokens.spacing.xs,
      strokeWidth: semanticTokens.borderWidth.normal,
    }])
  ) as HightideIconTokens
)
