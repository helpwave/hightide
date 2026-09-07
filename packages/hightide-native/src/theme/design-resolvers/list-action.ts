import type { ColorToken } from '@helpwave/hightide-design/primitive-tokens'
import { HexColorUtils } from '@helpwave/hightide-design/utils'
import {
  listActionOverlayTokens,
  type ListActionTokenResolver,
  type ListItemTokens,
  type ListNavigationTokenResolver,
  type PressableStateValue
} from '@helpwave/hightide-design/component-tokens'
import { resolveTokenConfig } from '../static-resolve/resolve'
import {
  mapButtonVariant,
  resolveColoringColorVariant,
  resolveColoringStyle,
  resolvePressableColoring,
  resolvePressableStateLayerTint
} from './semantic'
import { listItemTokenResolver } from './list-item'

type ListActionTokenState = PressableStateValue | 'colored'

type ListActionParams = {
  background: ColorToken,
  foreground: ColorToken,
  outlineColor: ColorToken,
  descriptionColor: ColorToken,
}

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
    themeTokens,
    coloring: resolveColoringColorVariant({
      themeTokens,
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
    resolved.background,
    tint
  )
  const base = listItemTokenResolver({
    themeTokens,
    semanticResolvers,
  })
  const states = new Set<ListActionTokenState>(state)

  if (hasColor) {
    states.add('colored')
  }

  const overlay = resolveTokenConfig<Pick<ListItemTokens, 'container' | 'titleText' | 'descriptionText' | 'icon'>>(
    listActionOverlayTokens,
    states,
    {
      theme: themeTokens,
      params: {
        background,
        foreground: resolved.foreground,
        outlineColor: coloring.accent,
        descriptionColor: base.descriptionText.color ?? themeTokens.color.surface.onColor,
      } satisfies ListActionParams,
    }
  )

  return {
    ...base,
    container: {
      ...base.container,
      ...overlay.container,
    },
    titleText: {
      ...base.titleText,
      ...overlay.titleText,
    },
    descriptionText: {
      ...base.descriptionText,
      ...overlay.descriptionText,
    },
    icon: {
      ...base.icon,
      ...overlay.icon,
    },
  }
}

export const listNavigationTokenResolver: ListNavigationTokenResolver = listActionTokenResolver
