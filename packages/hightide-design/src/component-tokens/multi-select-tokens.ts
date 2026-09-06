import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import type { IconTokens } from './icon-tokens'
import { inputStateValues } from './input-tokens'
import type { TextStyleTokens } from './text-style-tokens'
import {
  stateful,
  tokenCalc,
  tokenColorBlend,
  tokenColorOpacity,
  tokenPath,
  tokenValue,
  whenState
} from './builders'

export const multiSelectStateValues = [
  ...inputStateValues,
  'open',
  'hasSelections',
  'selected',
  'highlighted',
] as const

export type MultiSelectStateValue = typeof multiSelectStateValues[number]

export type MultiSelectState = ReadonlySet<MultiSelectStateValue>

export const multiSelectStateValueSet: ReadonlySet<MultiSelectStateValue> = new Set(multiSelectStateValues)

export type MultiSelectComponentResolverProps = {
  config?: {
    hasSearch?: boolean,
  },
  overrides?: {
    color?: ColorPairToken,
  },
  state: MultiSelectState,
}

export type MultiSelectTokens = {
  trigger: ContainerTokens,
  stateLayer: ContainerTokens,
  triggerText: TextStyleTokens,
  overlay: ContainerTokens,
  menu: ContainerTokens,
  header: ContainerTokens,
  option: ContainerTokens,
  optionText: TextStyleTokens,
  emptyText: TextStyleTokens,
  checkbox: ContainerTokens,
  checkboxIcon: IconTokens,
}

export type MultiSelectTokenResolver = ComponentTokenResolver<
  MultiSelectComponentResolverProps,
  MultiSelectTokens
>

const menuHeight = tokenCalc(
  'multiply',
  tokenPath('theme.size.md'),
  tokenValue(11.5)
)

export const multiSelectTokens = {
  stateLayer: {
    backgroundColor: stateful(tokenPath('params.tint')),
  },
  header: {
    padding: stateful({
      type: 'physicalSide',
      top: tokenPath('theme.padding.xl'),
      bottom: tokenPath('theme.padding.md'),
      left: tokenPath('theme.padding.xl'),
      right: tokenPath('theme.padding.xl'),
    }),
  },
  menuSize: stateful(
    {
      maxHeight: menuHeight,
    },
    [
      whenState(['search'], {
        minHeight: menuHeight,
        height: menuHeight,
      }),
    ]
  ),
  option: {
    backgroundColor: stateful(
      {
        value: 'transparent',
      },
      [
        whenState(['highlighted'], tokenPath('params.hoverColor')),
      ]
    ),
    opacity: stateful(
      tokenValue(1),
      [
        whenState(['disabled'], tokenValue(0.5)),
      ]
    ),
    padding: stateful({
      type: 'physicalAxis',
      vertical: tokenPath('theme.padding.xl'),
      horizontal: tokenPath('theme.spacing.lg'),
    }),
    layout: stateful({
      direction: 'horizontal',
      crossAxisAlignment: 'center',
      gap: tokenPath('theme.padding.xl'),
    }),
  },
  optionText: {
    fontSize: stateful(tokenPath('theme.typography.body.md.fontSize')),
    fontFamily: stateful(tokenPath('theme.typography.body.md.fontFamily')),
    lineHeight: stateful(tokenPath('theme.typography.body.md.lineHeight')),
    fontWeight: stateful(
      tokenPath('theme.fontWeights.base'),
      [
        whenState(['selected'], tokenPath('theme.fontWeights.semibold')),
      ]
    ),
    color: stateful(
      tokenPath('theme.color.surface.onColor'),
      [
        whenState(['selected'], tokenPath('params.accentColor')),
      ]
    ),
  },
  emptyText: {
    fontSize: stateful(tokenPath('theme.typography.body.md.fontSize')),
    fontFamily: stateful(tokenPath('theme.typography.body.md.fontFamily')),
    lineHeight: stateful(tokenPath('theme.typography.body.md.lineHeight')),
    fontWeight: stateful(tokenPath('theme.typography.body.md.fontWeight')),
    color: stateful(
      tokenColorBlend(
        tokenPath('theme.color.surface.color'),
        tokenColorOpacity(
          tokenPath('theme.color.surface.onColor'),
          tokenPath('theme.config.appearancePercentages.subtle')
        )
      )
    ),
  },
} as const
