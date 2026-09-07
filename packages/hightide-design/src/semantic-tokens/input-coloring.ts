import {
  stateful,
  tokenPath,
  whenState
} from '../component-tokens/builders'
import type { ResolvableColor } from '../component-tokens/resolvable'
import { HexColorUtils } from '../utils/hex'

export const inputColoringTokens = {
  background: stateful(
    tokenPath('theme.color.surfaceVariant.color'),
    [
      whenState(['disabled'], tokenPath('theme.color.disabled.color')),
    ]
  ),
  text: stateful(
    tokenPath('theme.color.surface.onColor'),
    [
      whenState(['disabled'], tokenPath('theme.color.disabled.onColor')),
    ]
  ),
  border: stateful<string, ResolvableColor<string, string>>(
    tokenPath('theme.color.border'),
    [
      whenState(['disabled'], { value: HexColorUtils.transparent }),
      whenState(['invalid'], tokenPath('theme.color.negative.color'), ['disabled']),
      whenState(['focused'], tokenPath('params.accentPair.color'), ['disabled', 'invalid']),
    ]
  ),
} as const
