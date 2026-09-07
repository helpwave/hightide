import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import { HexColorUtils } from '../utils/hex'
import {
  stateful,
  tokenCalc,
  tokenColorBlend,
  tokenColorOpacity,
  tokenPath,
  tokenValue,
  whenState
} from './builders'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import type { IconTokens } from './icon-tokens'
import { type InputStateValue } from './input-tokens'
import type { Resolvable } from './resolvable'
import type { TextStyleTokens } from './text-style-tokens'

export type SelectStateValue =
  | InputStateValue
  | 'open'
  | 'hasValue'
  | 'selected'
  | 'highlighted'

export type SelectState = ReadonlySet<SelectStateValue>

export type SelectComponentResolverProps = {
  config?: {
    hasSearch?: boolean,
  },
  overrides?: {
    color?: ColorPairToken,
  },
  state: SelectState,
}

export type SelectTokens = {
  trigger: ContainerTokens,
  stateLayer: ContainerTokens,
  triggerText: TextStyleTokens,
  icon: IconTokens,
  overlay: ContainerTokens,
  menu: ContainerTokens,
  header: ContainerTokens,
  option: ContainerTokens,
  optionText: TextStyleTokens,
  emptyText: TextStyleTokens,
}

export type SelectTokenResolver = ComponentTokenResolver<
  SelectComponentResolverProps,
  SelectTokens
>

const menuHeight = tokenCalc(
  'multiply',
  tokenPath('theme.size.md'),
  tokenValue(11.5)
)

export const selectTokens = {
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
  menuSize: stateful<string, Resolvable<NonNullable<ContainerTokens['size']>, string, string>>(
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
    backgroundColor: stateful<string, Resolvable<NonNullable<ContainerTokens['backgroundColor']>, string, string>>(
      {
        value: HexColorUtils.transparent,
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
