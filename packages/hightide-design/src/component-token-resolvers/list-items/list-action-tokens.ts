import {
  mapPressableVariant,
  resolveColoringColorVariant,
  resolveColoringStyle,
  resolvePressableColoring
} from '../../semantic-token-resolvers'
import type { ColorPairToken } from '../../theme-tokens/theme-tokens-config'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ButtonState } from '../button-tokens'
import { toActivePressableStates } from '../pressable'
import {
  listItemTokenResolver,
  type ListItemTokens
} from './list-item-tokens'

export type ListActionItemState = ButtonState

export type ListActionComponentResolverProps = {
  overrides?: {
    color?: ColorPairToken,
  },
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
  state,
}) => {
  const hasColor = overrides?.color !== undefined
  const variant = hasColor ? 'tonal' : 'foreground'
  const { colorVariant, style } = mapPressableVariant(variant)
  const coloring = resolveColoringStyle({
    coloring: resolveColoringColorVariant({
      colorPair: overrides?.color ?? {
        color: themeTokens.color.surface.onColor,
        onColor: themeTokens.color.surface.color,
      },
      variant: colorVariant,
    }),
    style,
  })
  const resolved = resolvePressableColoring({
    themeTokens,
    coloring,
    variant,
    state: toActivePressableStates(state),
  })
  const hasOutline = resolved.outline !== 'transparent'
  const base = listItemTokenResolver({
    themeTokens,
    semanticResolvers,
  })

  return {
    ...base,
    container: {
      ...base.container,
      backgroundColor: resolved.background,
      outline: hasOutline ? {
        offset: -themeTokens.borders.borderWidths.normal,
        width: themeTokens.borders.borderWidths.normal,
        color: resolved.outline,
        style: 'solid'
      } : undefined,
    },
    titleText: {
      ...base.titleText,
      color: resolved.foreground,
    },
    descriptionText: {
      ...base.descriptionText,
      color: hasColor ? resolved.foreground : base.descriptionText.color,
    },
    icon: {
      ...base.icon,
      color: resolved.foreground,
    },
  }
}
