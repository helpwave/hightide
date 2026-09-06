import {
  stateful,
  tokenCalc,
  tokenPath,
  tokenValue,
  whenState
} from '../builders'
import type { ComponentTokenResolver } from '../component-token-resolver'
import {
  type ListItemTokens
} from './list-item-tokens'
import type { ColorPairToken } from '../../theme-tokens/theme-tokens-config'
import type { PressableState } from '../pressable-tokens'

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

export const listActionOverlayTokens = {
  container: {
    backgroundColor: stateful(tokenPath('params.background')),
    outline: stateful({
      width: tokenPath('theme.focusOutline.width'),
      offset: tokenCalc(
        'multiply',
        tokenPath('theme.focusOutline.width'),
        tokenValue(-1)
      ),
      style: tokenPath('theme.focusOutline.style'),
      color: {
        value: 'transparent',
      },
    }, [
      whenState(['focusVisible'], {
        width: tokenPath('theme.focusOutline.width'),
        offset: tokenCalc(
          'multiply',
          tokenPath('theme.focusOutline.width'),
          tokenValue(-1)
        ),
        style: tokenPath('theme.focusOutline.style'),
        color: tokenPath('params.outlineColor'),
      }),
    ]),
  },
  titleText: {
    color: stateful(tokenPath('params.foreground')),
  },
  descriptionText: {
    color: stateful(
      tokenPath('params.descriptionColor'),
      [
        whenState(['colored'], tokenPath('params.foreground')),
      ]
    ),
  },
  icon: {
    color: stateful(tokenPath('params.foreground')),
  },
} as const
