import { TokenBuilder } from '../../utils'
import type { AssertAssignable, ColorToken, HightideResolverConfig, HightideResolverParams, ResolverState } from '../../primitive-tokens'
import type { ColorPairToken } from '../../theme-tokens/create'
import { HexColorUtils } from '../../utils/hex'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ComponentTokens } from '../component-tokens'
import type { ResolvableContainerTokens } from '../resolvable-container-tokens'
import type { ResolvableIconTokens } from '../resolvable-icon-tokens'
import type { ResolvableTextStyleTokens } from '../resolvable-text-style-tokens'
import { type InputStateValue } from './input-tokens'
import type { HightideTokenPathProvider } from './token-context'

export type SelectStateValue =
  | InputStateValue
  | 'open'
  | 'hasValue'
  | 'selected'
  | 'highlighted'
  | 'search'

export type SelectState = AssertAssignable<SelectStateValue, ResolverState>
export type SelectConfig = HightideResolverConfig

export type SelectComponentResolverProps = {
  config?: {
    hasSearch?: boolean,
  },
  overrides?: {
    color?: ColorPairToken,
  },
  state: ReadonlySet<SelectStateValue>,
}

export type SelectTokens = AssertAssignable<{
  trigger: ResolvableContainerTokens<SelectState, SelectConfig>,
  stateLayer: ResolvableContainerTokens<SelectState, SelectConfig>,
  triggerText: ResolvableTextStyleTokens<SelectState, SelectConfig>,
  icon: ResolvableIconTokens<SelectState, SelectConfig>,
  overlay: ResolvableContainerTokens<SelectState, SelectConfig>,
  menu: ResolvableContainerTokens<SelectState, SelectConfig>,
  header: ResolvableContainerTokens<SelectState, SelectConfig>,
  option: ResolvableContainerTokens<SelectState, SelectConfig>,
  optionText: ResolvableTextStyleTokens<SelectState, SelectConfig>,
  emptyText: ResolvableTextStyleTokens<SelectState, SelectConfig>,
}, ComponentTokens<SelectState, SelectConfig>>

export type SelectTokenResolver = ComponentTokenResolver<
  SelectComponentResolverProps,
  SelectTokens
>

export type SelectParams = AssertAssignable<{
  colors: {
    tint: ColorToken,
    tintColor: ColorToken,
    accent: ColorToken,
  },
}, HightideResolverParams>
export type SelectTokenContext = HightideTokenPathProvider<SelectParams>

const menuHeight = TokenBuilder.calc(
  'multiply',
  TokenBuilder.numberRef<SelectTokenContext>('theme.size.md'),
  TokenBuilder.number(11.5)
)

export const selectTokens = {
  stateLayer: {
    kind: 'container' as const,
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorRef<SelectTokenContext>('params.colors.tint')),
  },
  header: {
    kind: 'container' as const,
    padding: TokenBuilder.padding({ top: TokenBuilder.numberRef<SelectTokenContext>('theme.padding.xl'), bottom: TokenBuilder.numberRef<SelectTokenContext>('theme.padding.md'), left: TokenBuilder.numberRef<SelectTokenContext>('theme.padding.xl'), right: TokenBuilder.numberRef<SelectTokenContext>('theme.padding.xl') }),
  },
  menuSize: TokenBuilder.stateful(
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
  option: {
    kind: 'container' as const,
    backgroundColor: TokenBuilder.stateful(
      TokenBuilder.color(HexColorUtils.transparent),
      [
        TokenBuilder.whenState(['highlighted'], TokenBuilder.colorRef<SelectTokenContext>('params.colors.tintColor')),
      ]
    ),
    opacity: TokenBuilder.stateful(
      TokenBuilder.number(1),
      [
        TokenBuilder.whenState(['disabled'], TokenBuilder.number(0.5)),
      ]
    ),
    padding: TokenBuilder.padding({ vertical: TokenBuilder.numberRef<SelectTokenContext>('theme.padding.xl'), horizontal: TokenBuilder.numberRef<SelectTokenContext>('theme.spacing.lg') }),
  },
  optionText: {
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef<SelectTokenContext>('theme.typography.body.md.fontSize')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef<SelectTokenContext>('theme.typography.body.md.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef<SelectTokenContext>('theme.typography.body.md.lineHeight')),
    fontWeight: TokenBuilder.statefulField<NumberToken>(
      TokenBuilder.numberRef<SelectTokenContext>('theme.fontWeights.base'),
      [
        TokenBuilder.whenState(['selected'], TokenBuilder.numberRef<SelectTokenContext>('theme.fontWeights.semibold')),
      ]
    ),
    color: TokenBuilder.statefulField<ColorToken, SelectTokenContext>(
      TokenBuilder.colorRef<SelectTokenContext>('theme.color.surface.onColor'),
      [
        TokenBuilder.whenState(['selected'], TokenBuilder.colorRef<SelectTokenContext>('params.colors.accent')),
      ]
    ),
  },
  emptyText: {
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef<SelectTokenContext>('theme.typography.body.md.fontSize')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef<SelectTokenContext>('theme.typography.body.md.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef<SelectTokenContext>('theme.typography.body.md.lineHeight')),
    fontWeight: TokenBuilder.stateful(TokenBuilder.numberRef<SelectTokenContext>('theme.typography.body.md.fontWeight')),
    color: TokenBuilder.stateful(
      TokenBuilder.colorBlend(
        TokenBuilder.colorRef<SelectTokenContext>('theme.color.surface.color'),
        TokenBuilder.colorOpacity(
          TokenBuilder.colorRef<SelectTokenContext>('theme.color.surface.onColor'),
          TokenBuilder.numberRef<SelectTokenContext>('theme.config.appearancePercentages.subtle')
        )
      )
    ),
  },
} as const
