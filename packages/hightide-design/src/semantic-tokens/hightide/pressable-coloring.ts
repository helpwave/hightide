import { TokenBuilder } from '../../utils'
import { HexColorUtils } from '../../utils/hex'
import type { ColorValueToken } from '../../primitive-tokens/color-value-token'
import type { TokenRef } from '../../utils/token-type'
import {
  buttonVariantsWithColorVariant,
  buttonVariantsWithStyle
} from './button-variant'

const colorProperty = (
  base: ColorValueToken | TokenRef<ColorValueToken>,
  overrides?: Parameters<typeof TokenBuilder.stateful<ColorValueToken | TokenRef<ColorValueToken>>>[1]
) => TokenBuilder.stateful(base, overrides)

const coloringBackground = TokenBuilder.colorValueRef(
  'params.colors.background',
  TokenBuilder.colorValueRef('semantics.color.coloringStyle.background')
)
const coloringForeground = TokenBuilder.colorValueRef(
  'params.colors.foreground',
  TokenBuilder.colorValueRef('semantics.color.coloringStyle.foreground')
)
const coloringAccent = TokenBuilder.colorValueRef(
  'params.colors.accent',
  TokenBuilder.colorValueRef('semantics.color.coloringStyle.accent')
)
const disabledFilledBackground = TokenBuilder.colorValueRef(
  'params.colors.disabledBackground',
  TokenBuilder.colorValueRef('theme.color.disabled.color')
)
const disabledForegroundStyleBackground = TokenBuilder.colorValueRef(
  'params.colors.disabledBackground',
  TokenBuilder.colorValue(TokenBuilder.color(HexColorUtils.transparent))
)
const disabledFilledForeground = TokenBuilder.colorValueRef(
  'params.colors.disabledForeground',
  TokenBuilder.colorValueRef('theme.color.disabled.onColor')
)
const disabledForegroundStyleForeground = TokenBuilder.colorValueRef(
  'params.colors.disabledForeground',
  TokenBuilder.colorValueRef('theme.color.disabled.color')
)
const disabledTonalBackground = TokenBuilder.colorBlend(
  TokenBuilder.colorValueRef('theme.color.surface.color'),
  TokenBuilder.colorOpacity(
    TokenBuilder.colorValueRef('theme.color.disabled.color'),
    TokenBuilder.numberValue(TokenBuilder.number(0.8))
  )
)
const disabledTonalForeground = TokenBuilder.colorBlend(
  TokenBuilder.colorValueRef('theme.color.surface.onColor'),
  TokenBuilder.colorOpacity(
    TokenBuilder.colorValueRef('theme.color.disabled.onColor'),
    TokenBuilder.numberValue(TokenBuilder.number(0.8))
  )
)

export const pressableColoringTokens = {
  background: colorProperty(
    coloringBackground,
    [
      TokenBuilder.whenState(['disabled'], disabledFilledBackground, undefined, { coloringStyle: 'filled' }),
      ...buttonVariantsWithStyle('filled').map((variant) => (
        TokenBuilder.whenState(['disabled'], disabledFilledBackground, undefined, { variant })
      )),
      TokenBuilder.whenState(
        ['disabled'],
        disabledForegroundStyleBackground,
        undefined,
        { coloringStyle: 'foreground' }
      ),
      ...buttonVariantsWithStyle('foreground').map((variant) => (
        TokenBuilder.whenState(['disabled'], disabledForegroundStyleBackground, undefined, { variant })
      )),
      TokenBuilder.whenState(
        ['disabled'],
        disabledTonalBackground,
        undefined,
        { coloringColorVariant: 'tonal' }
      ),
      ...buttonVariantsWithColorVariant('tonal').map((variant) => (
        TokenBuilder.whenState(['disabled'], disabledTonalBackground, undefined, { variant })
      )),
    ]
  ),
  foreground: colorProperty(
    coloringForeground,
    [
      TokenBuilder.whenState(['disabled'], disabledFilledForeground, undefined, { coloringStyle: 'filled' }),
      ...buttonVariantsWithStyle('filled').map((variant) => (
        TokenBuilder.whenState(['disabled'], disabledFilledForeground, undefined, { variant })
      )),
      TokenBuilder.whenState(
        ['disabled'],
        disabledForegroundStyleForeground,
        undefined,
        { coloringStyle: 'foreground' }
      ),
      ...buttonVariantsWithStyle('foreground').map((variant) => (
        TokenBuilder.whenState(['disabled'], disabledForegroundStyleForeground, undefined, { variant })
      )),
      TokenBuilder.whenState(
        ['disabled'],
        disabledTonalForeground,
        undefined,
        { coloringColorVariant: 'tonal' }
      ),
      ...buttonVariantsWithColorVariant('tonal').map((variant) => (
        TokenBuilder.whenState(['disabled'], disabledTonalForeground, undefined, { variant })
      )),
    ]
  ),
  border: colorProperty(
    TokenBuilder.colorValue(TokenBuilder.color(HexColorUtils.transparent)),
    [
      TokenBuilder.whenState(['outlined'], coloringAccent),
      TokenBuilder.whenState(['disabled'], TokenBuilder.colorValue(TokenBuilder.color(HexColorUtils.transparent))),
    ]
  ),
  outline: colorProperty(
    TokenBuilder.colorValue(TokenBuilder.color(HexColorUtils.transparent)),
    [
      TokenBuilder.whenState(['focusVisible'], coloringAccent),
      TokenBuilder.whenState(['disabled'], TokenBuilder.colorValue(TokenBuilder.color(HexColorUtils.transparent))),
    ]
  ),
} as const

const stateLayerTintColor = TokenBuilder.colorValueRef(
  'params.colors.tint',
  TokenBuilder.colorValueRef('semantics.color.coloringStyle.foreground')
)

export const pressableStateLayerTintTokens = {
  tint: colorProperty(
    TokenBuilder.colorValue(TokenBuilder.color(HexColorUtils.transparent)),
    [
      TokenBuilder.whenState(
        ['hovered'],
        TokenBuilder.colorOpacity(
          stateLayerTintColor,
          TokenBuilder.numberRef('theme.color.tintConfig.light')
        ),
        ['disabled']
      ),
      TokenBuilder.whenState(
        ['focusVisible'],
        TokenBuilder.colorOpacity(
          stateLayerTintColor,
          TokenBuilder.numberRef('theme.color.tintConfig.normal')
        ),
        ['disabled']
      ),
      TokenBuilder.whenState(
        ['pressed'],
        TokenBuilder.colorOpacity(
          stateLayerTintColor,
          TokenBuilder.numberRef('theme.color.tintConfig.normal')
        ),
        ['disabled']
      ),
    ]
  ),
} as const
