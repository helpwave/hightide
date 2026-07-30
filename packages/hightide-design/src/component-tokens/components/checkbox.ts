import type { HightideControlElementLayoutToken } from '../../semantic-tokens/elementLayout'
import type { HightideSemanticTokens } from '../../semantic-tokens/semanticTokens'
import type {
  ComponentSize,
  ComponentSizeBasic
} from '../../theme-tokens/layout'

export type HightideCheckboxTokens = {
  layout: Record<ComponentSizeBasic, HightideControlElementLayoutToken>,
}

const checkboxControlSize: Record<ComponentSizeBasic, ComponentSize> = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
}

export const toCheckboxTokens = (
  semanticTokens: HightideSemanticTokens
): HightideCheckboxTokens => {
  const control = semanticTokens.elementLayout.control

  const layout = Object.fromEntries(
    (['sm', 'md', 'lg'] as const).map((size) => {
      const controlSize = checkboxControlSize[size]
      return [size, control[controlSize]]
    })
  ) as HightideCheckboxTokens['layout']

  return { layout }
}
