import { TokenBuilder } from '../../utils'
import type { AssertAssignable, HightideResolverConfig, ResolverState } from '../../primitive-tokens'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ComponentTokens } from '../component-tokens'
import type { ResolvableContainerTokens } from '../resolvable-container-tokens'
import { elevationTokens } from './elevation-tokens'

export type ModalState = ResolverState
export type ModalConfig = HightideResolverConfig

export type ModalTokens = AssertAssignable<{
  background: ResolvableContainerTokens<ModalState, ModalConfig>,
  menu: ResolvableContainerTokens<ModalState, ModalConfig>,
  closeButton: ResolvableContainerTokens<ModalState, ModalConfig>,
}, ComponentTokens<ModalState, ModalConfig>>

export type ModalTokenResolver = ComponentTokenResolver<
  object,
  ModalTokens
>

export const modalTokens = {
  background: {
    kind: 'container' as const,
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorRef('theme.color.overlay')),
    padding: TokenBuilder.padding({ vertical: TokenBuilder.numberRef('theme.spacing.xl'), horizontal: TokenBuilder.numberRef('theme.spacing.xl') }),
    layout: TokenBuilder.stateful({
      direction: 'vertical',
      mainAxisAlignment: 'center',
      flexGrow: TokenBuilder.number(1),
    }),
  },
  menu: {
    kind: 'container' as const,
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorRef('theme.color.surfaceVariant.color')),
    overflow: TokenBuilder.stateful('hidden'),
    position: TokenBuilder.stateful({
      type: 'relative',
    }),
    layout: TokenBuilder.stateful({
      direction: 'vertical',
      crossAxisAlignment: 'stretch',
    }),
    borderRadius: TokenBuilder.borderRadius({ value: TokenBuilder.numberRef('theme.borderRadius.lg') }),
    border: TokenBuilder.stateful({
      width: TokenBuilder.sides({ value: TokenBuilder.numberRef('theme.borderWidth.thin') }),
      color: TokenBuilder.sides({ value: TokenBuilder.colorRef('theme.color.border') }),
    }),
    shadow: TokenBuilder.stateful(elevationTokens('level4')),
  },
  closeButton: {
    kind: 'container' as const,
    position: TokenBuilder.stateful({
      type: 'absolute',
      top: TokenBuilder.number(0),
      right: TokenBuilder.number(0),
      zIndex: TokenBuilder.number(1),
    }),
    padding: TokenBuilder.padding({ top: TokenBuilder.numberRef('theme.padding.md'), right: TokenBuilder.numberRef('theme.padding.md') }),
  },
} as const
