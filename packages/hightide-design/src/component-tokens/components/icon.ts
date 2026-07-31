import type { HightideSemanticTokens } from '../../semantic-tokens/semanticTokens'
import { componentSizes, type ComponentSize } from '../componentSize'


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
