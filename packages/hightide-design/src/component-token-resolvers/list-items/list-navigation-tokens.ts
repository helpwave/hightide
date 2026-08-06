import type { ColorPairToken } from '../../theme-tokens/theme-tokens-config'
import { resolveColorPairColoring } from '../coloring'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ButtonState } from '../button-tokens'
import {
  listItemTokenResolver,
  type ListItemTokens
} from './list-item-tokens'

export type CardLinkState = ButtonState

export type ListNavigationComponentResolverProps = {
  overrides?: {
    color?: ColorPairToken,
  },
  state: CardLinkState,
}

export type ListNavigationTokenResolver = ComponentTokenResolver<
  ListNavigationComponentResolverProps,
  ListItemTokens
>

export const listNavigationTokenResolver: ListNavigationTokenResolver = ({
  themeTokens,
  semanticResolvers,
  overrides,
  state,
}) => {
  const base = listItemTokenResolver({
    themeTokens,
    semanticResolvers,
    overrides,
  })
  const isPressed = !!state.isPressed && !state.isDisabled
  const hoverColor = resolveColorPairColoring({
    themeTokens,
    semanticResolvers,
    colorPair: overrides?.color ?? themeTokens.color.surface,
    style: overrides?.color !== undefined ? 'tonal' : 'filled',
    state: { isHovered: true },
  }).color

  return {
    ...base,
    container: {
      ...base.container,
      backgroundColor: isPressed
        ? hoverColor
        : base.container.backgroundColor ?? 'transparent',
    },
  }
}
