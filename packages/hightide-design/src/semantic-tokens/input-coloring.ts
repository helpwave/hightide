import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import {
  createTokenVariable,
  whenState,
  statefulField
} from '../component-tokens/builders'
import type { ColorToken } from '../primitive-tokens/color'
import type { ComponentTokenConfig } from '../component-tokens/token-config'
import type { TokenContext } from '../component-tokens/token-context'
import type { InputColoringTokens } from './types'
import { HexColorUtils } from '../utils/hex'

export type InputColoringParams = {
  accentPair: ColorPairToken,
}

const tokenVariable = createTokenVariable<InputColoringParams>()

export const inputColoringTokens = {
  background: statefulField<ColorToken>(
    tokenVariable('theme.color.surfaceVariant.color'),
    [
      whenState(['disabled'], tokenVariable('theme.color.disabled.color')),
    ]
  ),
  text: statefulField<ColorToken>(
    tokenVariable('theme.color.surface.onColor'),
    [
      whenState(['disabled'], tokenVariable('theme.color.disabled.onColor')),
    ]
  ),
  border: statefulField<ColorToken, TokenContext<InputColoringParams>>(
    tokenVariable('theme.color.border'),
    [
      whenState(['disabled'], { value: HexColorUtils.transparent }),
      whenState(['invalid'], tokenVariable('theme.color.negative.color'), ['disabled']),
      whenState(['focused'], tokenVariable('params.accentPair.color'), ['disabled', 'invalid']),
    ]
  ),
} as const satisfies ComponentTokenConfig<InputColoringTokens, TokenContext<InputColoringParams>>
