import type { ColorToken } from '../primitive-tokens/color'
import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import { HexColorUtils } from '../utils/hex'
import {
  stateful,
  tokenCalc,
  tokenColorBlend,
  tokenColorOpacity,
  createTokenVariable,
  tokenValue,
  whenState,
  statefulField
} from './builders'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import type { IconTokens } from './icon-tokens'
import { type InputStateValue } from './input-tokens'
import type { TextStyleTokens } from './text-style-tokens'
import type { ComponentTokenConfig, ComponentTokenConfigValue } from './token-config'
import type { TokenContext } from './token-context'

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

export type SelectParams = {
  tint: ColorToken,
  hoverColor: ColorToken,
  accentColor: ColorToken,
}
export type SelectTokenContext = TokenContext<SelectParams>

const tokenVariable = createTokenVariable<SelectParams>()

const menuHeight = tokenCalc(
  'multiply',
  tokenVariable('theme.size.md'),
  tokenValue(11.5)
)

export const selectTokens = {
  stateLayer: {
    backgroundColor: stateful(tokenVariable('params.tint')),
  },
  header: {
    padding: stateful({
      type: 'physicalSide',
      top: tokenVariable('theme.padding.xl'),
      bottom: tokenVariable('theme.padding.md'),
      left: tokenVariable('theme.padding.xl'),
      right: tokenVariable('theme.padding.xl'),
    }),
  },
  menuSize: stateful<string, ComponentTokenConfigValue<NonNullable<ContainerTokens['size']>, SelectTokenContext>>(
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
    backgroundColor: stateful<string, ComponentTokenConfigValue<NonNullable<ContainerTokens['backgroundColor']>, SelectTokenContext>>(
      {
        value: HexColorUtils.transparent,
      },
      [
        whenState(['highlighted'], tokenVariable('params.hoverColor')),
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
      vertical: tokenVariable('theme.padding.xl'),
      horizontal: tokenVariable('theme.spacing.lg'),
    }),
  },
  optionText: {
    fontSize: stateful(tokenVariable('theme.typography.body.md.fontSize')),
    fontFamily: stateful(tokenVariable('theme.typography.body.md.fontFamily')),
    lineHeight: stateful(tokenVariable('theme.typography.body.md.lineHeight')),
    fontWeight: statefulField<number>(
      tokenVariable('theme.fontWeights.base'),
      [
        whenState(['selected'], tokenVariable('theme.fontWeights.semibold')),
      ]
    ),
    color: statefulField<ColorToken, SelectTokenContext>(
      tokenVariable('theme.color.surface.onColor'),
      [
        whenState(['selected'], tokenVariable('params.accentColor')),
      ]
    ),
  },
  emptyText: {
    fontSize: stateful(tokenVariable('theme.typography.body.md.fontSize')),
    fontFamily: stateful(tokenVariable('theme.typography.body.md.fontFamily')),
    lineHeight: stateful(tokenVariable('theme.typography.body.md.lineHeight')),
    fontWeight: stateful(tokenVariable('theme.typography.body.md.fontWeight')),
    color: stateful(
      tokenColorBlend(
        tokenVariable('theme.color.surface.color'),
        tokenColorOpacity(
          tokenVariable('theme.color.surface.onColor'),
          tokenVariable('theme.config.appearancePercentages.subtle')
        )
      )
    ),
  },
} as const satisfies ComponentTokenConfig<SelectTokens & {
  menuSize: ContainerTokens['size']
}, SelectTokenContext>
