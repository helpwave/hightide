import { TokenBuilder } from '../../utils'
import type { AssertAssignable, ColorValueToken, HightideResolverConfig, HightideResolverParams, ResolverState } from '../../primitive-tokens'
import type { ColorPairToken } from '../../theme-tokens/create'
import { HexColorUtils } from '../../utils/hex'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ComponentTokens } from '../component-tokens'
import type { ResolvableContainerTokens } from '../resolvable-container-tokens'
import type { ResolvableLeaves } from '../resolvable-leaves'
import type { ContainerSizeTokens } from '../container-tokens'
import type { ResolvableIconTokens } from '../resolvable-icon-tokens'
import type { ResolvableTextStyleTokens } from '../resolvable-text-style-tokens'
import { inputStateValues } from './input-tokens'
import type { HightideTokenPathProvider } from './token-context'

export const multiSelectStateValues = [
  ...inputStateValues,
  'open',
  'hasSelections',
  'selected',
  'highlighted',
  'search',
] as const

export type MultiSelectStateValue = typeof multiSelectStateValues[number]

export type MultiSelectState = AssertAssignable<MultiSelectStateValue, ResolverState>
export type MultiSelectConfig = HightideResolverConfig

export const multiSelectStateValueSet: ReadonlySet<MultiSelectStateValue> = new Set(multiSelectStateValues)

export type MultiSelectComponentResolverProps = {
  config?: {
    hasSearch?: boolean,
  },
  overrides?: {
    color?: ColorPairToken,
  },
  state: ReadonlySet<MultiSelectStateValue>,
}

export type MultiSelectTokens = AssertAssignable<{
  trigger: ResolvableContainerTokens<MultiSelectState, MultiSelectConfig>,
  stateLayer: ResolvableContainerTokens<MultiSelectState, MultiSelectConfig>,
  triggerText: ResolvableTextStyleTokens<MultiSelectState, MultiSelectConfig>,
  overlay: ResolvableContainerTokens<MultiSelectState, MultiSelectConfig>,
  menu: ResolvableContainerTokens<MultiSelectState, MultiSelectConfig>,
  header: ResolvableContainerTokens<MultiSelectState, MultiSelectConfig>,
  option: ResolvableContainerTokens<MultiSelectState, MultiSelectConfig>,
  optionText: ResolvableTextStyleTokens<MultiSelectState, MultiSelectConfig>,
  emptyText: ResolvableTextStyleTokens<MultiSelectState, MultiSelectConfig>,
  checkbox: ResolvableContainerTokens<MultiSelectState, MultiSelectConfig>,
  checkboxIcon: ResolvableIconTokens<MultiSelectState, MultiSelectConfig>,
}, ComponentTokens<MultiSelectState, MultiSelectConfig>>

export type MultiSelectTokenResolver = ComponentTokenResolver<
  MultiSelectComponentResolverProps,
  MultiSelectTokens
>

export type MultiSelectParams = AssertAssignable<{
  colors: {
    tint: ColorValueToken,
    tintColor: ColorValueToken,
    accent: ColorValueToken,
  },
}, HightideResolverParams>
export type MultiSelectTokenContext = HightideTokenPathProvider<MultiSelectParams>

const menuHeight = TokenBuilder.calc(
  'multiply',
  TokenBuilder.numberRef<MultiSelectTokenContext>('theme.size.md'),
  TokenBuilder.numberValue(TokenBuilder.number(11.5))
)

export const multiSelectTokens = {
  stateLayer: {
    type: 'container',
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorValueRef<MultiSelectTokenContext>('params.colors.tint')),
  },
  header: {
    type: 'container',
    padding: TokenBuilder.padding({ top: TokenBuilder.numberRef<MultiSelectTokenContext>('theme.padding.xl'), bottom: TokenBuilder.numberRef<MultiSelectTokenContext>('theme.padding.md'), left: TokenBuilder.numberRef<MultiSelectTokenContext>('theme.padding.xl'), right: TokenBuilder.numberRef<MultiSelectTokenContext>('theme.padding.xl') }),
  },
  menu: {
    type: 'container',
    size: TokenBuilder.stateful<ResolvableLeaves<ContainerSizeTokens>, MultiSelectState>(
      {
        maxHeight: menuHeight,
      },
      [
        TokenBuilder.whenState(['search'], {
          minHeight: menuHeight,
          height: menuHeight,
        }),
      ]
    ),
  },
  option: {
    type: 'container',
    backgroundColor: TokenBuilder.stateful(
      TokenBuilder.colorValue(TokenBuilder.color(HexColorUtils.transparent)),
      [
        TokenBuilder.whenState(['highlighted'], TokenBuilder.colorValueRef<MultiSelectTokenContext>('params.colors.tintColor')),
      ]
    ),
    opacity: TokenBuilder.stateful(
      TokenBuilder.numberValue(TokenBuilder.number(1)),
      [
        TokenBuilder.whenState(['disabled'], TokenBuilder.numberValue(TokenBuilder.number(0.5))),
      ]
    ),
    padding: TokenBuilder.padding({ vertical: TokenBuilder.numberRef<MultiSelectTokenContext>('theme.padding.xl'), horizontal: TokenBuilder.numberRef<MultiSelectTokenContext>('theme.spacing.lg') }),
    layout: TokenBuilder.stateful({
      direction: TokenBuilder.layoutDirection('horizontal'),
      crossAxisAlignment: TokenBuilder.crossAxisAlignment('center'),
      gap: TokenBuilder.numberRef<MultiSelectTokenContext>('theme.padding.xl'),
    }),
  },
  optionText: {
    type: 'textStyle',
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef<MultiSelectTokenContext>('theme.typography.body.md.fontSize')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef<MultiSelectTokenContext>('theme.typography.body.md.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef<MultiSelectTokenContext>('theme.typography.body.md.lineHeight')),
    fontWeight: TokenBuilder.stateful(
      TokenBuilder.numberRef<MultiSelectTokenContext>('theme.fontWeights.base'),
      [
        TokenBuilder.whenState(['selected'], TokenBuilder.numberRef<MultiSelectTokenContext>('theme.fontWeights.semibold')),
      ]
    ),
    color: TokenBuilder.stateful(
      TokenBuilder.colorValueRef<MultiSelectTokenContext>('theme.color.surface.onColor'),
      [
        TokenBuilder.whenState(['selected'], TokenBuilder.colorValueRef<MultiSelectTokenContext>('params.colors.accent')),
      ]
    ),
  },
  emptyText: {
    type: 'textStyle',
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef<MultiSelectTokenContext>('theme.typography.body.md.fontSize')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef<MultiSelectTokenContext>('theme.typography.body.md.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef<MultiSelectTokenContext>('theme.typography.body.md.lineHeight')),
    fontWeight: TokenBuilder.stateful(TokenBuilder.numberRef<MultiSelectTokenContext>('theme.typography.body.md.fontWeight')),
    color: TokenBuilder.stateful(
      TokenBuilder.colorBlend(
        TokenBuilder.colorValueRef<MultiSelectTokenContext>('theme.color.surface.color'),
        TokenBuilder.colorOpacity(
          TokenBuilder.colorValueRef<MultiSelectTokenContext>('theme.color.surface.onColor'),
          TokenBuilder.numberRef<MultiSelectTokenContext>('theme.config.appearancePercentages.subtle')
        )
      )
    ),
  },
} as const
