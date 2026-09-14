import { TokenBuilder } from '../../../utils'
import type { AssertAssignable, ColorToken, HightideResolverConfig, HightideResolverParams, ResolverState } from '../../../primitive-tokens'
import type { ColorPairToken } from '../../../theme-tokens/create'
import { HexColorUtils } from '../../../utils/hex'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ComponentTokens } from '../../component-tokens'
import type { ResolvableContainerTokens } from '../../resolvable-container-tokens'
import type { ResolvableIconTokens } from '../../resolvable-icon-tokens'
import type { ResolvableTextStyleTokens } from '../../resolvable-text-style-tokens'
import { type PressableStateValue } from '../pressable-tokens'
import type { HightideTokenPathProvider } from '../token-context'

export type ListActionItemState = AssertAssignable<PressableStateValue | 'colored', ResolverState>
export type ListActionItemConfig = HightideResolverConfig

export type ListActionComponentResolverProps = {
  overrides?: {
    color?: ColorPairToken,
  },
  state: ReadonlySet<PressableStateValue>,
}

export type ListActionTokens = AssertAssignable<{
  container: ResolvableContainerTokens<ListActionItemState, ListActionItemConfig>,
  titleText: ResolvableTextStyleTokens<ListActionItemState, ListActionItemConfig>,
  descriptionText: ResolvableTextStyleTokens<ListActionItemState, ListActionItemConfig>,
  icon: ResolvableIconTokens<ListActionItemState, ListActionItemConfig>,
}, ComponentTokens<ListActionItemState, ListActionItemConfig>>

export type ListActionTokenResolver = ComponentTokenResolver<
  ListActionComponentResolverProps,
  ListActionTokens
>

export type ListActionParams = AssertAssignable<{
  colors: {
    background: ColorToken,
    foreground: ColorToken,
    accent: ColorToken,
    onColor: ColorToken,
  },
}, HightideResolverParams>
export type ListActionTokenContext = HightideTokenPathProvider<ListActionParams>

export const listActionOverlayTokens = {
  container: {
    kind: 'container' as const,
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorRef<ListActionTokenContext>('params.colors.background')),
    outline: TokenBuilder.stateful({
      width: TokenBuilder.numberRef<ListActionTokenContext>('theme.focusOutline.width'),
      offset: TokenBuilder.calc(
        'multiply',
        TokenBuilder.numberRef<ListActionTokenContext>('theme.focusOutline.width'),
        TokenBuilder.number(-1)
      ),
      style: TokenBuilder.outlineStyleRef<ListActionTokenContext>('theme.focusOutline.style'),
      color: TokenBuilder.color(HexColorUtils.transparent),
    }, [
      TokenBuilder.whenState(['focusVisible'], {
        width: TokenBuilder.numberRef<ListActionTokenContext>('theme.focusOutline.width'),
        offset: TokenBuilder.calc(
          'multiply',
          TokenBuilder.numberRef<ListActionTokenContext>('theme.focusOutline.width'),
          TokenBuilder.number(-1)
        ),
        style: TokenBuilder.outlineStyleRef<ListActionTokenContext>('theme.focusOutline.style'),
        color: TokenBuilder.colorRef<ListActionTokenContext>('params.colors.accent'),
      }),
    ]),
  },
  titleText: {
    color: TokenBuilder.stateful(TokenBuilder.colorRef<ListActionTokenContext>('params.colors.foreground')),
  },
  descriptionText: {
    color: TokenBuilder.statefulField<ColorToken, ListActionTokenContext>(
      TokenBuilder.colorRef<ListActionTokenContext>('params.colors.onColor'),
      [
        TokenBuilder.whenState(['colored'], TokenBuilder.colorRef<ListActionTokenContext>('params.colors.foreground')),
      ]
    ),
  },
  icon: {
    kind: 'icon' as const,
    color: TokenBuilder.stateful(TokenBuilder.colorRef<ListActionTokenContext>('params.colors.foreground')),
  },
} as const
