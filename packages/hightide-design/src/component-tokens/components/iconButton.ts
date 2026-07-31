import type { HightideSemanticTokens } from '../../semantic-tokens/semanticTokens'
import {
  componentSizes,
  type ComponentSize
} from '../componentSize'
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
  sm: 14,
  md: 14,
  lg: 18,
}

export const toIconButtonTokens = (
  semanticTokens: HightideSemanticTokens
): HightideIconButtonTokens => {
  const control = semanticTokens.elementLayout.control

  const layout = Object.fromEntries(
    componentSizes.map((size) => {
      const token = control[size]

      return [size, {
        size: token.size,
        inset: token.inset,
        borderWidth: token.borderWidth,
        borderRadius: token.borderRadius,
        fontSize: buttonFontSizes[size],
      } satisfies IconButtonLayoutToken]
    })
  ) as Record<ComponentSize, IconButtonLayoutToken>

  return {
    layout,
    colorSchemes: toPressableColorSchemes(semanticTokens.colorSchemes),
  }
}
