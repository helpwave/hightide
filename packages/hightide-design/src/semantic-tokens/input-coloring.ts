import {
  stateful,
  tokenPath,
  transparentColor,
  whenState
} from '../component-tokens/builders'

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
  border: stateful(
    tokenPath('theme.color.border'),
    [
      whenState(['disabled'], transparentColor()),
      whenState(['invalid'], tokenPath('theme.color.negative.color'), ['disabled']),
      whenState(['focused'], tokenPath('params.accentPair.color'), ['disabled', 'invalid']),
    ]
  ),
} as const
