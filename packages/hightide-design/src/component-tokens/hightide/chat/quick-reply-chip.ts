import { TokenBuilder } from '../../../utils'
import type { AssertAssignable, HightideResolverConfig, ResolverState } from '../../../primitive-tokens'
import type { ColorToken } from '../../../primitive-tokens/color-token'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ResolvableContainerTokens } from '../../resolvable-container-tokens'
import type { ContainerTokens } from '../../container-tokens'
import type { ResolvableTextStyleTokens } from '../../resolvable-text-style-tokens'
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
  container?: ResolvableContainerTokens<ChatQuickReplyChipState, ChatQuickReplyChipConfig>,
  text?: ResolvableTextStyleTokens<ChatQuickReplyChipState, ChatQuickReplyChipConfig>,
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
    kind: 'container' as const,
    borderRadius: TokenBuilder.borderRadius({ value: TokenBuilder.number(pillBorderRadius) }),
    padding: TokenBuilder.padding({ vertical: TokenBuilder.numberRef('theme.padding.md'), horizontal: TokenBuilder.numberRef('theme.padding.lg') }),
    border: TokenBuilder.statefulField<NonNullable<ContainerTokens['border']>>({
      width: TokenBuilder.sides({ value: TokenBuilder.numberRef('theme.borderWidth.thin') }),
      color: TokenBuilder.sides({ value: surfaceFadedColor }),
    }, [
      TokenBuilder.whenState(['active'], {
        width: TokenBuilder.sides({ value: TokenBuilder.numberRef('theme.borderWidth.thin') }),
        color: TokenBuilder.sides({ value: TokenBuilder.colorRef('theme.color.primary.color') }),
      }),
    ]),
    layout: TokenBuilder.stateful({
      direction: 'horizontal',
      crossAxisAlignment: 'center',
      gap: TokenBuilder.numberRef('theme.padding.md'),
    }),
  },
  stateLayer: {
    kind: 'container' as const,
    borderRadius: TokenBuilder.borderRadius({ value: TokenBuilder.number(pillBorderRadius) }),
  },
  text: {
    kind: 'textStyle' as const,
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.sm.fontSize')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef('theme.typography.body.sm.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.body.sm.lineHeight')),
    fontWeight: TokenBuilder.stateful(TokenBuilder.numberRef('theme.fontWeights.medium')),
    color: TokenBuilder.statefulField<ColorToken>(
      surfaceDescriptionColor,
      [
        TokenBuilder.whenState(['active'], TokenBuilder.colorRef('theme.color.primary.color')),
      ]
    ),
  },
} as const
