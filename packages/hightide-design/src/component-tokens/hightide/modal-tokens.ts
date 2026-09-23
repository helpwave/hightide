import { TokenBuilder } from '../../utils'
import type { AssertAssignable, HightideResolverConfig, ResolverState } from '../../primitive-tokens'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ComponentTokens } from '../component-tokens'
import type { ContainerTokens } from '../container-tokens'
import { elevationTokens } from './elevation-tokens'

export type ModalState = ResolverState
export type ModalConfig = HightideResolverConfig

export type ModalTokens = AssertAssignable<{
  background: ContainerTokens,
  menu: ContainerTokens,
  closeButton: ContainerTokens,
}, ComponentTokens<ModalState, ModalConfig>>

export type ModalTokenResolver = ComponentTokenResolver<
  object,
  ModalTokens
>

export const modalTokens = {
  background: {
    type: 'container',
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorValueRef('theme.color.overlay')),
    padding: TokenBuilder.padding({ vertical: TokenBuilder.numberRef('theme.spacing.xl'), horizontal: TokenBuilder.numberRef('theme.spacing.xl') }),
    layout: TokenBuilder.stateful({
      direction: TokenBuilder.layoutDirection('vertical'),
      mainAxisAlignment: TokenBuilder.mainAxisAlignment('center'),
      flexGrow: TokenBuilder.numberValue(TokenBuilder.number(1)),
    }),
  },
  menu: {
    type: 'container',
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorValueRef('theme.color.surfaceVariant.color')),
    overflow: TokenBuilder.stateful(TokenBuilder.overflow('hidden')),
    position: TokenBuilder.stateful({
      type: 'relative' as const,
    }),
    layout: TokenBuilder.stateful({
      direction: TokenBuilder.layoutDirection('vertical'),
      crossAxisAlignment: TokenBuilder.crossAxisAlignment('stretch'),
    }),
    borderRadius: TokenBuilder.borderRadius({ value: TokenBuilder.numberRef('theme.borderRadius.lg') }),
    border: TokenBuilder.stateful({
      width: TokenBuilder.sides({ value: TokenBuilder.numberRef('theme.borderWidth.thin') }),
      color: TokenBuilder.sides({ value: TokenBuilder.colorValueRef('theme.color.border') }),
    }),
    shadow: TokenBuilder.stateful(elevationTokens('level4')),
  },
  closeButton: {
    type: 'container',
    position: TokenBuilder.stateful({
      type: 'absolute' as const,
      top: TokenBuilder.numberValue(TokenBuilder.number(0)),
      right: TokenBuilder.numberValue(TokenBuilder.number(0)),
      zIndex: TokenBuilder.numberValue(TokenBuilder.number(1)),
    }),
    padding: TokenBuilder.padding({ top: TokenBuilder.numberRef('theme.padding.md'), right: TokenBuilder.numberRef('theme.padding.md') }),
  },
} as const
