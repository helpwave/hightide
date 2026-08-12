import {
  mapButtonVariant,
  resolveColoringColorVariant,
  resolveColoringStyle,
  resolvePressableColoring,
  resolvePressableStateLayerTint
} from '../../semantic-token-resolvers'
import type { ColorPairToken } from '../../theme-tokens/theme-tokens-config'
import { HexColorUtils } from '../../utils/hex'
import type { ComponentTokenResolver } from '../component-token-resolver'
import {
  listItemTokenResolver,
  type ListItemTokens
} from './list-item-tokens'
import type { PressableState } from '../pressable-tokens'

export type ListActionItemState = PressableState

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
  const { colorVariant, style } = mapButtonVariant(variant)
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
    state,
  })
  const tint = resolvePressableStateLayerTint({
    themeTokens,
    states: state,
    color: coloring.foreground,
  })

  const background = HexColorUtils.blend(
    resolved.background === 'transparent' ? '#FFFFFF00' : resolved.background,
    tint === 'transparent' ? '#FFFFFF00' : tint
  )
  const isFocusVisible = state.has('focusVisible')
  const outlineColor = coloring.accent
  const base = listItemTokenResolver({
    themeTokens,
    semanticResolvers,
  })

  return {
    ...base,
    container: {
      ...base.container,
      backgroundColor: background,
      outline: {
        ...themeTokens.focusOutline,
        offset: themeTokens.focusOutline.width ? themeTokens.focusOutline.width * -1 : undefined,
        color: isFocusVisible ? outlineColor : 'transparent',
      },
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
