import type { ColorToken } from '@helpwave/hightide-design/primitive-tokens'
import {
  selectTokens,
  toInputState,
  toPressableState,
  type ContainerTokens,
  type PressableStateValue,
  type SelectStateValue,
  type SelectTokenResolver,
  type TextStyleTokens
} from '@helpwave/hightide-design/component-tokens'
import { resolveConfigNode } from '../static-resolve/resolve'
import {
  resolveColoringColorVariant,
  resolveColoringStyle,
  resolvePressableColoring,
  resolvePressableStateLayerTint
} from './semantic'
import { inputTokenResolver } from './input'
import { modalTokenResolver } from './modal'

type SelectTokenState = SelectStateValue | 'search'

type SelectParams = {
  tint: ColorToken,
  hoverColor: ColorToken,
  accentColor: ColorToken,
}

export const selectTokenResolver: SelectTokenResolver = ({
  themeTokens,
  semanticResolvers,
  config,
  overrides,
  state,
}) => {
  const accentPair = overrides?.color ?? themeTokens.color.primary
  const hasSearch = config?.hasSearch ?? true
  const input = inputTokenResolver({
    themeTokens,
    semanticResolvers,
    overrides: {
      color: overrides?.color,
    },
    state: toInputState(state),
  })
  const tint = resolvePressableStateLayerTint({
    themeTokens,
    states: toPressableState(state),
    color: input.text.color ?? themeTokens.color.surface.onColor,
  })
  const hoverColor = resolvePressableColoring({
    themeTokens,
    coloring: resolveColoringStyle({
      themeTokens,
      coloring: resolveColoringColorVariant({
        themeTokens,
        colorPair: themeTokens.color.surface,
        variant: 'normal',
      }),
      style: 'filled',
    }),
    variant: 'filled',
    state: new Set<PressableStateValue>(['hovered']),
  }).background
  const modal = modalTokenResolver({
    themeTokens,
    semanticResolvers,
  })
  const inputPadding = input.container.padding
  const horizontalPadding = inputPadding?.type === 'physicalAxis'
    ? inputPadding.horizontal
    : undefined
  const states = new Set<SelectTokenState>(state)

  if (hasSearch) {
    states.add('search')
  }

  const resolved = resolveConfigNode<{
    stateLayer: ContainerTokens,
    header: ContainerTokens,
    menuSize: ContainerTokens['size'],
    option: ContainerTokens,
    optionText: TextStyleTokens,
    emptyText: TextStyleTokens,
  }>(
    selectTokens,
    {
      theme: themeTokens,
      params: {
        tint,
        hoverColor,
        accentColor: accentPair.color,
      } satisfies SelectParams,
      state: states,
    }
  )

  return {
    trigger: {
      ...input.container,
      layout: {
        ...input.container.layout,
        direction: 'horizontal',
        crossAxisAlignment: 'center',
        mainAxisAlignment: 'space-between',
        gap: horizontalPadding,
      },
    },
    stateLayer: resolved.stateLayer,
    triggerText: state.has('hasValue') ? input.text : input.placeholder,
    icon: input.icon,
    overlay: modal.background,
    menu: {
      ...modal.menu,
      size: resolved.menuSize,
    },
    header: resolved.header,
    option: resolved.option,
    optionText: resolved.optionText,
    emptyText: resolved.emptyText,
  }
}
