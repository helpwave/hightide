import { TokenBuilder } from '../../utils'
import type { HexColor } from '../../utils/hex-color'
import { isColorToken } from '../../primitive-tokens/color-token'
import type { ColorValueToken } from '../../primitive-tokens/color-value-token'
import type { NumberToken } from '../../primitive-tokens/number-token'
import type { NumberValueToken } from '../../primitive-tokens/number-value-token'
import type { FontSizingToken as PrimitiveFontSizingToken } from '../../primitive-tokens/font-sizing-token'
import type { ColorPairToken, FontSizingToken } from './theme-tokens-config'

export const wrapColor = (value: HexColor): ColorValueToken => (
  TokenBuilder.colorValue(TokenBuilder.color(value))
)

export const hexFromColorValue = (token: ColorValueToken): HexColor => {
  if (isColorToken(token.value)) {
    return token.value.value
  }

  throw new Error('Theme ColorValueToken must wrap a ColorToken')
}

export const wrapNumber = (value: number | NumberToken): NumberValueToken => (
  TokenBuilder.numberValue(
    typeof value === 'number' ? TokenBuilder.number(value) : value
  )
)

export const colorPair = (color: HexColor, onColor: HexColor): ColorPairToken => ({
  color: wrapColor(color),
  onColor: wrapColor(onColor),
})

export const wrapFontSizing = (
  sizing: PrimitiveFontSizingToken
): FontSizingToken => ({
  fontSize: wrapNumber(sizing.fontSize),
  lineHeight: wrapNumber(sizing.lineHeight),
})
