import { TokenBuilder } from '../../utils'
import type { AssertAssignable, ColorValueToken, HightideResolverConfig, HightideResolverParams, ResolverState } from '../../primitive-tokens'
import type { ColorPairToken } from '../../theme-tokens/create'
import { HexColorUtils } from '../../utils/hex'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ComponentTokens } from '../component-tokens'
import type { ContainerTokens } from '../container-tokens'
import type { ResolvableLeaves } from '../resolvable-leaves'
import type { ContainerSizeTokens } from '../container-tokens'
import type { IconTokens } from '../icon-tokens'
import type { TextTokens } from '../text-tokens'
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
  trigger: ContainerTokens,
  stateLayer: ContainerTokens,
  triggerText: TextTokens,
  icon: IconTokens,
  overlay: ContainerTokens,
  menu: ContainerTokens,
  header: ContainerTokens,
  option: ContainerTokens,
  optionText: TextTokens,
  emptyText: TextTokens,
}, ComponentTokens<SelectConfig>>

export type SelectTokenResolver = ComponentTokenResolver<
  SelectComponentResolverProps,
  SelectTokens
>

export type SelectParams = AssertAssignable<{
  colors: {
    tint: ColorValueToken,
    tintColor: ColorValueToken,
    accent: ColorValueToken,
  },
}, HightideResolverParams>
export type SelectTokenContext = HightideTokenPathProvider<SelectParams>

const menuHeight = TokenBuilder.calc(
  'multiply',
  TokenBuilder.numberRef<SelectTokenContext>('theme.size.md'),
  TokenBuilder.numberValue(TokenBuilder.number(11.5))
)

export const selectTokens = {
  stateLayer: {
    type: 'container',
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorValueRef<SelectTokenContext>('params.colors.tint')),
  },
  header: {
    type: 'container',
    padding: TokenBuilder.padding({ top: TokenBuilder.numberRef<SelectTokenContext>('theme.padding.xl'), bottom: TokenBuilder.numberRef<SelectTokenContext>('theme.padding.md'), left: TokenBuilder.numberRef<SelectTokenContext>('theme.padding.xl'), right: TokenBuilder.numberRef<SelectTokenContext>('theme.padding.xl') }),
  },
  menu: {
    type: 'container',
    size: TokenBuilder.stateful<ResolvableLeaves<ContainerSizeTokens>>(
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
        TokenBuilder.whenState(['highlighted'], TokenBuilder.colorValueRef<SelectTokenContext>('params.colors.tintColor')),
      ]
    ),
    opacity: TokenBuilder.stateful(
      TokenBuilder.numberValue(TokenBuilder.number(1)),
      [
        TokenBuilder.whenState(['disabled'], TokenBuilder.numberValue(TokenBuilder.number(0.5))),
      ]
    ),
    padding: TokenBuilder.padding({ vertical: TokenBuilder.numberRef<SelectTokenContext>('theme.padding.xl'), horizontal: TokenBuilder.numberRef<SelectTokenContext>('theme.spacing.lg') }),
  },
  optionText: {
    type: 'textStyle',
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef<SelectTokenContext>('theme.typography.body.md.fontSize')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef<SelectTokenContext>('theme.typography.body.md.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef<SelectTokenContext>('theme.typography.body.md.lineHeight')),
    fontWeight: TokenBuilder.stateful(
      TokenBuilder.numberRef<SelectTokenContext>('theme.fontWeights.base'),
      [
        TokenBuilder.whenState(['selected'], TokenBuilder.numberRef<SelectTokenContext>('theme.fontWeights.semibold')),
      ]
    ),
    color: TokenBuilder.stateful(
      TokenBuilder.colorValueRef<SelectTokenContext>('theme.color.surface.onColor'),
      [
        TokenBuilder.whenState(['selected'], TokenBuilder.colorValueRef<SelectTokenContext>('params.colors.accent')),
      ]
    ),
  },
  emptyText: {
    type: 'textStyle',
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef<SelectTokenContext>('theme.typography.body.md.fontSize')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef<SelectTokenContext>('theme.typography.body.md.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef<SelectTokenContext>('theme.typography.body.md.lineHeight')),
    fontWeight: TokenBuilder.stateful(TokenBuilder.numberRef<SelectTokenContext>('theme.typography.body.md.fontWeight')),
    color: TokenBuilder.stateful(
      TokenBuilder.colorBlend(
        TokenBuilder.colorValueRef<SelectTokenContext>('theme.color.surface.color'),
        TokenBuilder.colorOpacity(
          TokenBuilder.colorValueRef<SelectTokenContext>('theme.color.surface.onColor'),
          TokenBuilder.numberRef<SelectTokenContext>('theme.config.appearancePercentages.subtle')
        )
      )
    ),
  },
} as const
