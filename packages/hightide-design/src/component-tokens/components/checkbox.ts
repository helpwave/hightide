import type { ColorToken } from '../../primitive-tokens/color'
import type { HightideSemanticTokens } from '../../semantic-tokens/semanticTokens'
import type { ComponentSize } from '../componentSize'

export type CheckboxBoxLayoutToken = {
  size: number,
  inset: number,
  borderWidth: number,
  borderRadius: number,
}

export type CheckboxIconLayoutToken = {
  size: number,
}

export type HightideCheckboxTokens = {
  background: ColorToken,
  box: {
    layout: Record<ComponentSize, CheckboxBoxLayoutToken>,
  },
  icon: {
    layout: Record<ComponentSize, CheckboxIconLayoutToken>,
  },
}

const checkboxSizes = ['sm', 'md', 'lg'] as const satisfies readonly ComponentSize[]

export const toCheckboxTokens = (
  semanticTokens: HightideSemanticTokens
): HightideCheckboxTokens => {
  const control = semanticTokens.elementLayout.control

  const boxLayout = Object.fromEntries(
    checkboxSizes.map((size) => {
      const token = control[size]
      return [size, {
        size: token.size - 2 * token.inset - 2 * token.borderWidth,
        inset: semanticTokens.elementLayout.control.xs.inset,
        borderWidth: semanticTokens.borderWidth.normal,
        borderRadius: token.borderRadius,
      } satisfies CheckboxBoxLayoutToken]
    })
  ) as HightideCheckboxTokens['box']['layout']

  const iconLayout = Object.fromEntries(
    checkboxSizes.map((size) => {
      const box = boxLayout[size]
      return [size, {
        size: box.size - 2 * box.inset - 2 * box.borderWidth,
      } satisfies CheckboxIconLayoutToken]
    })
  ) as HightideCheckboxTokens['icon']['layout']

  return {
    background: semanticTokens.colors.surface,
    box: {
      layout: boxLayout,
    },
    icon: {
      layout: iconLayout,
    },
  }
}
