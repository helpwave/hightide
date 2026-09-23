import { TokenBuilder } from '../../../utils'
import type { AssertAssignable, ColorValueToken, HightideResolverConfig, HightideResolverParams, ResolverState } from '../../../primitive-tokens'
import type { ColorPairToken } from '../../../theme-tokens/create'
import { HexColorUtils } from '../../../utils/hex'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ComponentTokens } from '../../component-tokens'
import type { ContainerTokens, OutlineTokens } from '../../container-tokens'
import type { IconTokens } from '../../icon-tokens'
import type { TextTokens } from '../../text-tokens'
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
  container: ContainerTokens,
  titleText: TextTokens,
  descriptionText: TextTokens,
  icon: IconTokens,
}, ComponentTokens<ListActionItemState, ListActionItemConfig>>

export type ListActionTokenResolver = ComponentTokenResolver<
  ListActionComponentResolverProps,
  ListActionTokens
>

export type ListActionParams = AssertAssignable<{
  colors: {
    background: ColorValueToken,
    foreground: ColorValueToken,
    accent: ColorValueToken,
    onColor: ColorValueToken,
  },
}, HightideResolverParams>
export type ListActionTokenContext = HightideTokenPathProvider<ListActionParams>

export const listActionOverlayTokens = {
  container: {
    type: 'container',
    backgroundColor: TokenBuilder.stateful(TokenBuilder.colorValueRef<ListActionTokenContext>('params.colors.background')),
    outline: TokenBuilder.stateful<OutlineTokens>({
      width: TokenBuilder.numberRef<ListActionTokenContext>('theme.focusOutline.width'),
      offset: TokenBuilder.calc(
        'multiply',
        TokenBuilder.numberRef<ListActionTokenContext>('theme.focusOutline.width'),
        TokenBuilder.numberValue(TokenBuilder.number(-1))
      ),
      style: TokenBuilder.outlineStyleRef<ListActionTokenContext>('theme.focusOutline.style'),
      color: TokenBuilder.colorValue(TokenBuilder.color(HexColorUtils.transparent)),
    }, [
      TokenBuilder.whenState(['focusVisible'], {
        width: TokenBuilder.numberRef<ListActionTokenContext>('theme.focusOutline.width'),
        offset: TokenBuilder.calc(
          'multiply',
          TokenBuilder.numberRef<ListActionTokenContext>('theme.focusOutline.width'),
          TokenBuilder.numberValue(TokenBuilder.number(-1))
        ),
        style: TokenBuilder.outlineStyleRef<ListActionTokenContext>('theme.focusOutline.style'),
        color: TokenBuilder.colorValueRef<ListActionTokenContext>('params.colors.accent'),
      }),
    ]),
  },
  titleText: {
    type: 'textStyle',
    color: TokenBuilder.stateful(TokenBuilder.colorValueRef<ListActionTokenContext>('params.colors.foreground')),
  },
  descriptionText: {
    type: 'textStyle',
    color: TokenBuilder.stateful(
      TokenBuilder.colorValueRef<ListActionTokenContext>('params.colors.onColor'),
      [
        TokenBuilder.whenState(['colored'], TokenBuilder.colorValueRef<ListActionTokenContext>('params.colors.foreground')),
      ]
    ),
  },
  icon: {
    type: 'icon',
    color: TokenBuilder.stateful(TokenBuilder.colorValueRef<ListActionTokenContext>('params.colors.foreground')),
  },
} as const
