import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'

export type CardTokens = ContainerTokens

export type CardTokenResolver = ComponentTokenResolver<
  object,
  CardTokens
>

export const cardTokenResolver: CardTokenResolver = ({ themeTokens }) => {
  const { color, borderRadius, elevation } = themeTokens

  return {
    backgroundColor: color.surface.color,
    shape: {
      borderRadius: { type: 'all', value: borderRadius.lg },
    },
    layout: {
      direction: 'vertical',
      crossAxisAlignment: 'center',
      mainAxisAlignment: 'start',
      gap: 0,
    },
    decoration: {
      shadow: elevation.level2
    }
  }
}
