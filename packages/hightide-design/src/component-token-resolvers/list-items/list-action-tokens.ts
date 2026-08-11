import {
  mapPressableVariant,
  resolveColoringColorVariant,
  resolveColoringStyle,
  resolvePressableColoring,
  resolvePressableStateLayerTint
} from '../../semantic-token-resolvers'
import type { ColorPairToken } from '../../theme-tokens/theme-tokens-config'
import { HexColorUtils } from '../../utils/hex'
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
  const fullStates = toActivePressableStates(state)
  const resolved = resolvePressableColoring({
    themeTokens,
    coloring,
    variant,
    state: toActivePressableStates({
      isDisabled: state.isDisabled,
    }),
  })
  const tint = resolvePressableStateLayerTint({
    themeTokens,
    states: fullStates,
    color: coloring.foreground,
  })

  const background = HexColorUtils.blend(
    resolved.background === 'transparent' ? '#FFFFFF00' : resolved.background,
    tint === 'transparent' ? '#FFFFFF00' : tint
  )
  const isFocusVisible = fullStates.has('focusVisible')
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
