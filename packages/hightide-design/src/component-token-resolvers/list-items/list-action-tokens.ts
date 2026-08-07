import {
  resolveColoringStyle,
  resolvePressableColoring
} from '../../semantic-token-resolvers'
import type { ColorPairToken } from '../../theme-tokens/theme-tokens-config'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ButtonState } from '../button-tokens'
import { toActivePressableStates } from '../pressable'
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
  const coloringStyle = hasColor ? 'tonal' : 'text'
  const coloring = resolveColoringStyle({
    themeTokens,
    colorPair: overrides?.color ?? {
      color: themeTokens.color.surface.onColor,
      onColor: themeTokens.color.surface.color,
    },
    style: coloringStyle,
  })
  const resolved = resolvePressableColoring({
    themeTokens,
    coloring,
    style: coloringStyle,
    state: toActivePressableStates(state),
  })
  const hasOutline = resolved.outline !== 'transparent'
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
      backgroundColor: resolved.background,
      border: base.container.border,
      outline: hasOutline ? {
        offset: -themeTokens.borders.borderWidths.normal,
        width: themeTokens.borders.borderWidths.normal,
        color: resolved.outline,
        style: 'solid'
      } : undefined,
    },
    titleText: {
      ...base.titleText,
      color: resolved.text,
    },
    descriptionText: {
      ...base.descriptionText,
      color: hasColor ? resolved.text : base.descriptionText.color,
    },
    icon: {
      ...base.icon,
      color: resolved.text,
    },
  }
}
