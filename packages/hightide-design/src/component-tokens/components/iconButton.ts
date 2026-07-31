import type { HightideSemanticTokens } from '../../semantic-tokens/semanticTokens'
import type { ComponentSize } from '../../theme-tokens/layout'
import { componentSizes } from '../../theme-tokens/layout'
import type {
  PressableColorSchemes,
  PressableState,
  PressableStateBasedProperty
} from './pressable'
import { toPressableColorSchemes } from './pressable'

export type IconButtonLayoutToken = {
  size: number,
  inset: number,
  borderWidth: number,
  borderRadius: number,
  gap: number,
  horizontalInset: number,
  minWidth: number,
  fontSize: number,
}

export type IconButtonState = PressableState

export type IconButtonStateBasedProperty<P> = PressableStateBasedProperty<P>

export type IconButtonColorSchemes = PressableColorSchemes

export type HightideIconButtonTokens = {
  layout: Record<ComponentSize, IconButtonLayoutToken>,
  colorSchemes: IconButtonColorSchemes,
}

const buttonFontSizes: Record<ComponentSize, number> = {
  xs: 12,
  sm: 14,
  md: 14,
  lg: 18,
  xl: 20,
}

export const toIconButtonTokens = (
  semanticTokens: HightideSemanticTokens
): HightideIconButtonTokens => {
  const control = semanticTokens.elementLayout.control

  const layout = Object.fromEntries(
    componentSizes.map((size) => {
      const token = control[size]
      const gap = size === 'xs' || size === 'sm' ? semanticTokens.spacing.xs : semanticTokens.spacing.sm

      return [size, {
        size: token.size,
        inset: token.inset,
        borderWidth: token.borderWidth,
        borderRadius: token.borderRadius,
        gap,
        horizontalInset: token.horizontalContentPadding ?? token.inset,
        minWidth: token.minimumWidth ?? token.size,
        fontSize: buttonFontSizes[size],
      } satisfies IconButtonLayoutToken]
    })
  ) as Record<ComponentSize, IconButtonLayoutToken>

  return {
    layout,
    colorSchemes: toPressableColorSchemes(semanticTokens.colorSchemes),
  }
}
