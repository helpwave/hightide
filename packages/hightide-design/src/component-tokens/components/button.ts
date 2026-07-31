import type { HightideSemanticTokens } from '../../semantic-tokens/semanticTokens'
import type { ComponentSize } from '../../theme-tokens/layout'
import { componentSizes } from '../../theme-tokens/layout'
import type {
  PressableColorSchemes,
  PressableState,
  PressableStateBasedProperty
} from './pressable'
import { toPressableColorSchemes } from './pressable'

export type ButtonLayoutToken = {
  size: number,
  inset: number,
  border: number,
  radius: number,
  gap: number,
  horizontalInset: number,
  minWidth: number,
  fontSize: number,
}

export type ButtonState = PressableState

export type ButtonStateBasedProperty<P> = PressableStateBasedProperty<P>

export type ButtonColorSchemes = PressableColorSchemes

export type HightideButtonTokens = {
  layout: Record<ComponentSize, ButtonLayoutToken>,
  colorSchemes: ButtonColorSchemes,
}

const buttonFontSizes: Record<ComponentSize, number> = {
  xs: 12,
  sm: 14,
  md: 14,
  lg: 18,
  xl: 20,
}

export const toButtonTokens = (
  semanticTokens: HightideSemanticTokens
): HightideButtonTokens => {
  const control = semanticTokens.elementLayout.control

  const layout = Object.fromEntries(
    componentSizes.map((size) => {
      const token = control[size]
      const gap = size === 'xs' || size === 'sm' ? semanticTokens.spacing.xs : semanticTokens.spacing.sm

      return [size, {
        size: token.size,
        inset: token.inset,
        border: token.border,
        radius: semanticTokens.radius[size],
        gap,
        horizontalInset: token.horizontalContentPadding ?? token.inset,
        minWidth: token.minimumWidth ?? token.size,
        fontSize: buttonFontSizes[size],
      } satisfies ButtonLayoutToken]
    })
  ) as Record<ComponentSize, ButtonLayoutToken>

  return {
    layout,
    colorSchemes: toPressableColorSchemes(semanticTokens.colorSchemes),
  }
}
