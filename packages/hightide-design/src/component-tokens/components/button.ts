import type { HightideSemanticTokens } from '../../semantic-tokens/semanticTokens'
import type { ComponentSizeBasic } from '../../theme-tokens/layout'
import type {
  PressableColorSchemes,
  PressableState,
  PressableStateBasedProperty
} from './pressable'
import { toPressableColorSchemes } from './pressable'

export type ButtonLayoutToken = {
  size: number,
  inset: number,
  borderWidth: number,
  borderRadius: number,
  gap: number,
  horizontalInset: number,
  minWidth: number,
  fontSize: number,
}

export type ButtonState = PressableState

export type ButtonStateBasedProperty<P> = PressableStateBasedProperty<P>

export type ButtonColorSchemes = PressableColorSchemes

export type HightideButtonTokens = {
  layout: Record<ComponentSizeBasic, ButtonLayoutToken>,
  colorSchemes: ButtonColorSchemes,
}

const buttonSizes = ['sm', 'md', 'lg'] as const satisfies readonly ComponentSizeBasic[]

const buttonFontSizes: Record<ComponentSizeBasic, number> = {
  sm: 14,
  md: 14,
  lg: 18,
}

export const toButtonTokens = (
  semanticTokens: HightideSemanticTokens
): HightideButtonTokens => {
  const control = semanticTokens.elementLayout.control

  const layout = Object.fromEntries(
    buttonSizes.map((size) => {
      const token = control[size]
      const gap = size === 'sm' ? semanticTokens.spacing.xs : semanticTokens.spacing.sm

      return [size, {
        size: token.size,
        inset: token.inset,
        borderWidth: token.borderWidth,
        borderRadius: token.borderRadius,
        gap,
        horizontalInset: token.horizontalContentPadding ?? token.inset,
        minWidth: token.minimumWidth ?? token.size,
        fontSize: buttonFontSizes[size],
      } satisfies ButtonLayoutToken]
    })
  ) as Record<ComponentSizeBasic, ButtonLayoutToken>

  return {
    layout,
    colorSchemes: toPressableColorSchemes(semanticTokens.colorSchemes),
  }
}
