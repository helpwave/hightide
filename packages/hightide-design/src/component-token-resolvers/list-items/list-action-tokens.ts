import type { ColorPairToken } from '../../theme-tokens/theme-tokens-config'
import { resolveColorPairColoring } from '../coloring'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ButtonState } from '../button-tokens'
import {
  listItemTokenResolver,
  type ListItemConfig,
  type ListItemTokens,
  type ListPositionToken
} from './list-item-tokens'

export type ListActionItemState = ButtonState & {
  position?: ListPositionToken,
}

export type ListActionComponentResolverProps = {
  overrides?: {
    color?: ColorPairToken,
  },
  config?: ListItemConfig,
  state: ListActionItemState,
}

export type ListActionTokenResolver = ComponentTokenResolver<
  ListActionComponentResolverProps,
  ListItemTokens
>

export const listActionTokenResolver: ListActionTokenResolver = ({
  themeTokens,
  semanticResolvers,
  overrides,
  config,
  state,
}) => {
  const hasColor = overrides?.color !== undefined
  const coloring = resolveColorPairColoring({
    themeTokens,
    colorPair: overrides?.color ?? {
      color: themeTokens.color.surface.onColor,
      onColor: themeTokens.color.surface.color,
    },
    style: hasColor ? 'tonal' : 'text',
    state,
  })
  const base = listItemTokenResolver({
    themeTokens,
    semanticResolvers,
    config,
    state: {
      position: state.position,
    },
  })

  return {
    ...base,
    container: {
      ...base.container,
      backgroundColor: coloring.color,
      border: base.container.border,
      outline: coloring.outlineColor !== undefined ? {
        offset: -themeTokens.borders.borderWidths.normal,
        width: themeTokens.borders.borderWidths.normal,
        color: coloring.outlineColor,
        style: 'solid'
      } : undefined,
    },
    titleText: {
      ...base.titleText,
      color: coloring.onColor,
    },
    descriptionText: {
      ...base.descriptionText,
      color: hasColor ? coloring.onColor : base.descriptionText.color,
    },
    icon: {
      ...base.icon,
      color: coloring.onColor,
    },
  }
}
