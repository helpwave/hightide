import { TokenBuilder } from '../../utils'
import {
  type ChipVariant,
  type ComponentSize,
  toTypographySize
} from '../../semantic-tokens'
import type { ColorPairToken } from '../../theme-tokens/create'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ComponentTokens } from '../component-tokens'
import type { ResolvableContainerTokens } from '../resolvable-container-tokens'
import type { ResolvableIconTokens } from '../resolvable-icon-tokens'
import type { ResolvableTextStyleTokens } from '../resolvable-text-style-tokens'
import type { HightideTokenPathProvider } from './token-context'
import type { AssertAssignable, ColorValueToken, HightideResolverConfig, NumberValueToken, HightideResolverParams, ResolverState } from '../../primitive-tokens'

export type ChipParams = AssertAssignable<{
  colors: {
    background: ColorValueToken,
    foreground: ColorValueToken,
  },
  numbers: {
    size: NumberValueToken,
    borderRadius: NumberValueToken,
    inset: NumberValueToken,
    paddingExtension: NumberValueToken,
    gap: NumberValueToken,
    iconSize: NumberValueToken,
    iconStrokeWidth: NumberValueToken,
    fontSize: NumberValueToken,
    fontWeight: NumberValueToken,
    lineHeight: NumberValueToken,
  },
}, HightideResolverParams>

export type ChipTokenContext = HightideTokenPathProvider<ChipParams>

export type ChipState = ResolverState
export type ChipConfig = HightideResolverConfig

export type ChipComponentResolverProps = {
  overrides: {
    size?: ComponentSize,
    color?: ColorPairToken,
    variant?: ChipVariant,
  },
}

export type ChipTokens = AssertAssignable<{
  container: ResolvableContainerTokens<ChipState, ChipConfig>,
  icon: ResolvableIconTokens<ChipState, ChipConfig>,
  text: ResolvableTextStyleTokens<ChipState, ChipConfig>,
}, ComponentTokens<ChipState, ChipConfig>>

export type ChipTokenResolver = ComponentTokenResolver<
  ChipComponentResolverProps,
  ChipTokens
>

export const chipTokens = {
  container: {
    type: 'container',
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorValueRef<ChipTokenContext>('params.colors.background')),
    size: TokenBuilder.stateful({
      minWidth: TokenBuilder.numberValue(TokenBuilder.number(0)),
      minHeight: TokenBuilder.numberRef<ChipTokenContext>('params.numbers.size'),
    }),
    borderRadius: TokenBuilder.borderRadius({ value: TokenBuilder.numberRef<ChipTokenContext>('params.numbers.borderRadius') }),
    padding: TokenBuilder.padding({ vertical: TokenBuilder.numberRef<ChipTokenContext>('params.numbers.inset'), horizontal: TokenBuilder.calc(
        'add',
        TokenBuilder.numberRef<ChipTokenContext>('params.numbers.inset'),
        TokenBuilder.numberRef<ChipTokenContext>('params.numbers.paddingExtension')
      ) }),
    layout: TokenBuilder.stateful({
      gap: TokenBuilder.numberRef<ChipTokenContext>('params.numbers.gap'),
      direction: TokenBuilder.layoutDirection('horizontal'),
      mainAxisAlignment: TokenBuilder.mainAxisAlignment('start'),
      crossAxisAlignment: TokenBuilder.crossAxisAlignment('center'),
    }),
  },
  icon: {
    type: 'icon',
    size: TokenBuilder.stateful(TokenBuilder.numberRef<ChipTokenContext>('params.numbers.iconSize')),
    strokeWidth: TokenBuilder.stateful(TokenBuilder.numberRef<ChipTokenContext>('params.numbers.iconStrokeWidth')),
    color: TokenBuilder.stateful(TokenBuilder.colorValueRef<ChipTokenContext>('params.colors.foreground')),
  },
  text: {
    type: 'textStyle',
    color: TokenBuilder.stateful(TokenBuilder.colorValueRef<ChipTokenContext>('params.colors.foreground')),
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef<ChipTokenContext>('params.numbers.fontSize')),
    fontWeight: TokenBuilder.stateful(TokenBuilder.numberRef<ChipTokenContext>('params.numbers.fontWeight')),
    fontFamily: TokenBuilder.stateful(
      TokenBuilder.fontFamilyRef<ChipTokenContext>('theme.typography.label.md.fontFamily'),
      TokenBuilder.whenThemeSize((size) => TokenBuilder.fontFamilyRef<ChipTokenContext>(
        `theme.typography.label.${toTypographySize(size)}.fontFamily`
      ))
    ),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef<ChipTokenContext>('params.numbers.lineHeight')),
  },
} as const
