import { TokenBuilder } from '../../utils'
import { HexColorUtils } from '../../utils/hex'
import type { ColorValueToken } from '../../primitive-tokens/color-value-token'
import type { TokenRef } from '../../utils/token-type'
import {
  buttonVariantsWithColorVariant,
  buttonVariantsWithStyle,
  whenVariants
} from './button-variant'

const colorProperty = (
  base: ColorValueToken | TokenRef<ColorValueToken>,
  overrides?: Parameters<typeof TokenBuilder.stateful<ColorValueToken | TokenRef<ColorValueToken>>>[1]
) => TokenBuilder.stateful(base, overrides)

const colorPairColor = TokenBuilder.colorValueRef(
  'params.colors.color',
  TokenBuilder.colorValueRef('theme.color.primary.color')
)
const colorPairOnColor = TokenBuilder.colorValueRef(
  'params.colors.onColor',
  TokenBuilder.colorValueRef('theme.color.primary.onColor')
)
const tonalColor = TokenBuilder.colorLightness(
  colorPairColor,
  TokenBuilder.numberRef('theme.config.coloring.tonal.color')
)
const tonalOnColor = TokenBuilder.colorLightness(
  colorPairColor,
  TokenBuilder.numberRef('theme.config.coloring.tonal.onColor')
)
const transparentColor = TokenBuilder.colorOpacity(
  colorPairColor,
  TokenBuilder.numberRef('theme.config.coloring.transparent.color')
)
const transparentOnColor = TokenBuilder.colorOpacity(
  colorPairColor,
  TokenBuilder.numberRef('theme.config.coloring.transparent.onColor')
)

const tonalColorVariants = buttonVariantsWithColorVariant('tonal')
const foregroundStyleVariants = buttonVariantsWithStyle('foreground')

export const coloringVariantTokens = {
  color: colorProperty(
    colorPairColor,
    [
      TokenBuilder.whenConfig({ coloringColorVariant: 'tonal' }, tonalColor),
      ...whenVariants(tonalColorVariants, tonalColor),
      TokenBuilder.whenConfig({ coloringColorVariant: 'transparent' }, transparentColor),
    ]
  ),
  onColor: colorProperty(
    colorPairOnColor,
    [
      TokenBuilder.whenConfig({ coloringColorVariant: 'tonal' }, tonalOnColor),
      ...whenVariants(tonalColorVariants, tonalOnColor),
      TokenBuilder.whenConfig({ coloringColorVariant: 'transparent' }, transparentOnColor),
    ]
  ),
  accent: colorProperty(
    colorPairColor
  ),
} as const

const foregroundStyleColor = TokenBuilder.colorValueRef(
  'params.colors.color',
  TokenBuilder.colorValueRef('semantics.color.coloringVariant.color')
)
const filledStyleForeground = TokenBuilder.colorValueRef(
  'params.colors.onColor',
  TokenBuilder.colorValueRef('semantics.color.coloringVariant.onColor')
)
const foregroundStyleBackground = TokenBuilder.colorValue(TokenBuilder.color(HexColorUtils.transparent))

export const coloringStyleTokens = {
  foreground: colorProperty(
    filledStyleForeground,
    [
      TokenBuilder.whenConfig({ coloringStyle: 'foreground' }, foregroundStyleColor),
      ...whenVariants(foregroundStyleVariants, foregroundStyleColor),
    ]
  ),
  background: colorProperty(
    TokenBuilder.colorValueRef('params.colors.color',
      TokenBuilder.colorValueRef('semantics.color.coloringVariant.color')),
    [
      TokenBuilder.whenConfig({ coloringStyle: 'foreground' }, foregroundStyleBackground),
      ...whenVariants(foregroundStyleVariants, foregroundStyleBackground),
    ]
  ),
  accent: colorProperty(
    TokenBuilder.colorValueRef(
      'params.colors.accent',
      TokenBuilder.colorValueRef('semantics.color.coloringVariant.accent')
    )
  ),
} as const
