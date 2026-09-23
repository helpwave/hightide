import { TokenBuilder } from '../../../utils'
import type { AssertAssignable, ColorValueToken, HightideResolverConfig, NumberValueToken, ResolverState } from '../../../primitive-tokens'
import type { TokenRefOrValue } from '../../../utils/token-type'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../../container-tokens'
import type { TextTokens } from '../../text-tokens'
import type {
  PressableComponentResolverProps,
  PressableTokens
} from '../pressable-tokens'
import {
  pillBorderRadius,
  surfaceDescriptionColor,
  surfaceFadedColor
} from './shared'

export type ChatQuickReplyChipState = AssertAssignable<'active', ResolverState>
export type ChatQuickReplyChipConfig = HightideResolverConfig

export type ChatQuickReplyChipComponentResolverProps = {
  config: {
    isActive?: boolean,
  },
}

export type ChatQuickReplyChipTokens = Partial<PressableTokens> & {
  config: Partial<PressableComponentResolverProps['overrides']>,
  container?: ContainerTokens,
  text?: TextTokens,
}

export type ChatQuickReplyChipTokenResolver = ComponentTokenResolver<
  ChatQuickReplyChipComponentResolverProps,
  ChatQuickReplyChipTokens
>

export const chatQuickReplyChipTokens = {
  config: {
    coloringStyle: 'filled',
    coloringColorVariant: 'normal',
    size: 'sm',
  },
  container: {
    type: 'container',
    borderRadius: TokenBuilder.borderRadius({ value: TokenBuilder.numberValue(TokenBuilder.number(pillBorderRadius)) }),
    padding: TokenBuilder.padding({ vertical: TokenBuilder.numberRef('theme.padding.md'), horizontal: TokenBuilder.numberRef('theme.padding.lg') }),
    border: TokenBuilder.stateful({
      width: TokenBuilder.sides<TokenRefOrValue<NumberValueToken>>({ value: TokenBuilder.numberRef('theme.borderWidth.thin') }),
      color: TokenBuilder.sides<TokenRefOrValue<ColorValueToken>>({ value: surfaceFadedColor }),
    }, [
      TokenBuilder.whenState(['active'], {
        width: TokenBuilder.sides<TokenRefOrValue<NumberValueToken>>({ value: TokenBuilder.numberRef('theme.borderWidth.thin') }),
        color: TokenBuilder.sides<TokenRefOrValue<ColorValueToken>>({ value: TokenBuilder.colorValueRef('theme.color.primary.color') }),
      }),
    ]),
    layout: TokenBuilder.stateful({
      direction: TokenBuilder.layoutDirection('horizontal'),
      crossAxisAlignment: TokenBuilder.crossAxisAlignment('center'),
      gap: TokenBuilder.numberRef('theme.padding.md'),
    }),
  },
  stateLayer: {
    type: 'container',
    borderRadius: TokenBuilder.borderRadius({ value: TokenBuilder.numberValue(TokenBuilder.number(pillBorderRadius)) }),
  },
  text: {
    type: 'textStyle',
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.sm.fontSize')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef('theme.typography.body.sm.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.sm.lineHeight')),
    fontWeight: TokenBuilder.stateful(TokenBuilder.numberRef('theme.fontWeights.medium')),
    color: TokenBuilder.stateful(
      surfaceDescriptionColor,
      [
        TokenBuilder.whenState(['active'], TokenBuilder.colorValueRef('theme.color.primary.color')),
      ]
    ),
  },
} as const
