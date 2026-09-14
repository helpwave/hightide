import { TokenBuilder } from '../../utils'
import type { AssertAssignable, HightideResolverParams } from '../../primitive-tokens'
import { HexColorUtils } from '../../utils/hex'
import type { HightideSemanticTokens } from './semantic-tokens'

export type InputColoringParams = AssertAssignable<HightideResolverParams, HightideResolverParams>

export const inputColoringTokens = {
  background: TokenBuilder.statefulField(
    TokenBuilder.colorValueRef('theme.color.surfaceVariant.color'),
    [
      TokenBuilder.whenState(['disabled'], TokenBuilder.colorValueRef('theme.color.disabled.color')),
    ]
  ),
  text: TokenBuilder.statefulField(
    TokenBuilder.colorValueRef('theme.color.surface.onColor'),
    [
      TokenBuilder.whenState(['disabled'], TokenBuilder.colorValueRef('theme.color.disabled.onColor')),
    ]
  ),
  border: TokenBuilder.statefulField(
    TokenBuilder.colorValueRef('theme.color.border'),
    [
      TokenBuilder.whenState(['disabled'], TokenBuilder.colorValue(TokenBuilder.color(HexColorUtils.transparent))),
      TokenBuilder.whenState(['invalid'], TokenBuilder.colorValueRef('theme.color.negative.color'), ['disabled']),
      TokenBuilder.whenState(['focused'], TokenBuilder.colorValueRef('params.colors.accent'), ['disabled', 'invalid']),
    ]
  ),
} as const satisfies HightideSemanticTokens['color']['inputColoring']
