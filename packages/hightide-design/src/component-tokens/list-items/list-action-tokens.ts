import {
  stateful,
  tokenCalc,
  createTokenVariable,
  tokenValue,
  whenState,
  statefulField
} from '../builders'
import type { ComponentTokenResolver } from '../component-token-resolver'
import {
  type ListItemTokens
} from './list-item-tokens'
import type { ColorToken } from '../../primitive-tokens/color'
import type { ColorPairToken } from '../../theme-tokens/theme-tokens-config'
import { HexColorUtils } from '../../utils/hex'
import type { PressableState } from '../pressable-tokens'
import type { ContainerTokens } from '../container-tokens'
import type { ComponentTokenConfig, ComponentTokenConfigValue } from '../token-config'
import type { TokenContext } from '../token-context'

export type ListActionItemState = PressableState

export type ListActionComponentResolverProps = {
  overrides?: {
    color?: ColorPairToken,
  },
  state: ListActionItemState,
}

export type ListActionTokenResolver = ComponentTokenResolver<
  ListActionComponentResolverProps,
  ListItemTokens
>

export type ListActionParams = {
  background: ColorToken,
  foreground: ColorToken,
  outlineColor: ColorToken,
  descriptionColor: ColorToken,
}
export type ListActionTokenContext = TokenContext<ListActionParams>

const tokenVariable = createTokenVariable<ListActionParams>()

export const listActionOverlayTokens = {
  container: {
    backgroundColor: stateful(tokenVariable('params.background')),
    outline: stateful<string, ComponentTokenConfigValue<NonNullable<ContainerTokens['outline']>, ListActionTokenContext>>({
      width: tokenVariable('theme.focusOutline.width'),
      offset: tokenCalc(
        'multiply',
        tokenVariable('theme.focusOutline.width'),
        tokenValue(-1)
      ),
      style: tokenVariable('theme.focusOutline.style'),
      color: {
        value: HexColorUtils.transparent,
      },
    }, [
      whenState(['focusVisible'], {
        width: tokenVariable('theme.focusOutline.width'),
        offset: tokenCalc(
          'multiply',
          tokenVariable('theme.focusOutline.width'),
          tokenValue(-1)
        ),
        style: tokenVariable('theme.focusOutline.style'),
        color: tokenVariable('params.outlineColor'),
      }),
    ]),
  },
  titleText: {
    color: stateful(tokenVariable('params.foreground')),
  },
  descriptionText: {
    color: statefulField<ColorToken, ListActionTokenContext>(
      tokenVariable('params.descriptionColor'),
      [
        whenState(['colored'], tokenVariable('params.foreground')),
      ]
    ),
  },
  icon: {
    color: stateful(tokenVariable('params.foreground')),
  },
} as const satisfies ComponentTokenConfig<ListItemTokens, ListActionTokenContext>
