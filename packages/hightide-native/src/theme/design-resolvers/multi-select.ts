import type { ColorToken } from '@helpwave/hightide-design/primitive-tokens'
import { HexColorUtils } from '@helpwave/hightide-design/utils'
import {
  multiSelectTokens,
  toInputState,
  toPressableState,
  type CheckboxState,
  type CheckboxStateValue,
  type ContainerTokens,
  type MultiSelectState,
  type MultiSelectStateValue,
  type MultiSelectTokenResolver,
  type PressableStateValue,
  type TextStyleTokens
} from '@helpwave/hightide-design/component-tokens'
import { resolveConfigNode } from '../static-resolve/resolve'
import {
  resolveColoringColorVariant,
  resolveColoringStyle,
  resolvePressableColoring,
  resolvePressableStateLayerTint
} from './semantic'
import { checkboxTokenResolver } from './checkbox'
import { inputTokenResolver } from './input'
import { modalTokenResolver } from './modal'

const toCheckboxState = (state: MultiSelectState): CheckboxState => {
  const checkboxState = new Set<CheckboxStateValue>([...toInputState(state)])
  if (state.has('selected')) {
    checkboxState.add('checked')
  }
  if (state.has('highlighted')) {
    checkboxState.add('hovered')
  }
  return checkboxState
}

type MultiSelectTokenState = MultiSelectStateValue | 'search'

type MultiSelectParams = {
  tint: ColorToken,
  hoverColor: ColorToken,
  accentColor: ColorToken,
}

export const multiSelectTokenResolver: MultiSelectTokenResolver = ({
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
  const checkboxTokens = checkboxTokenResolver({
    themeTokens,
    semanticResolvers,
    overrides: {
      color: overrides?.color,
    },
    state: toCheckboxState(state),
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
  const states = new Set<MultiSelectTokenState>(state)

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
    multiSelectTokens,
    {
      theme: themeTokens,
      params: {
        tint,
        hoverColor,
        accentColor: accentPair.color,
      } satisfies MultiSelectParams,
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
        gap: themeTokens.spacing.md,
      },
      size: {
        ...input.container.size,
        width: '100%',
      },
    },
    stateLayer: resolved.stateLayer,
    triggerText: state.has('hasSelections') ? input.text : input.placeholder,
    overlay: modal.background,
    menu: {
      ...modal.menu,
      size: resolved.menuSize,
    },
    header: resolved.header,
    option: resolved.option,
    optionText: resolved.optionText,
    emptyText: resolved.emptyText,
    checkbox: checkboxTokens.container,
    checkboxIcon: {
      ...checkboxTokens.icon,
      color: state.has('selected') ? checkboxTokens.icon.color : HexColorUtils.transparent,
    },
  }
}
