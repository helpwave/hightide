import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'

export type CardTokens = ContainerTokens

export type CardTokenResolver = ComponentTokenResolver<
  Record<string, never>,
  CardTokens
>

export const cardTokenResolver: CardTokenResolver = ({ themeTokens }) => {
  const { color, shape, elevation } = themeTokens

  return {
    backgroundColor: color.surface.color,
    shape: {
      borderRadius: shape.borderRadius.lg,
    },
    layout: {
      direction: 'vertical',
      crossAxisAligment: 'center',
      mainAxisAlignment: 'start',
      gap: 0,
    },
    decoration: {
      shadow: elevation.level2
    }
  }
}
