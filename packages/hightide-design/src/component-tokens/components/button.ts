import type { HightideTypographyStyleToken } from '../../semantic-tokens/typography'
import type { HightideSemanticTokens } from '../../semantic-tokens/semanticTokens'
import type { ComponentSize } from '../componentSize'
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
  textStyle: HightideTypographyStyleToken,
}

export type ButtonState = PressableState

export type ButtonStateBasedProperty<P> = PressableStateBasedProperty<P>

export type ButtonColorSchemes = PressableColorSchemes

export type HightideButtonTokens = {
  layout: Record<ComponentSize, ButtonLayoutToken>,
  colorSchemes: ButtonColorSchemes,
}

const buttonSizes = ['sm', 'md', 'lg'] as const satisfies readonly ComponentSize[]

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
        textStyle: semanticTokens.typography.label[size],
      } satisfies ButtonLayoutToken]
    })
  ) as Record<ComponentSize, ButtonLayoutToken>

  return {
    layout,
    colorSchemes: toPressableColorSchemes(semanticTokens.colorSchemes),
  }
}
