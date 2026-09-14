import { TokenBuilder } from '../../utils'
import type { NumberValueToken } from '../../primitive-tokens/number-value-token'
import type { TokenRef } from '../../utils/token-type'
import { toTypographySize } from '../../semantic-tokens/hightide/element-layout'
import type { ThemeLayoutSize } from '../../theme-tokens/create'
import { toButtonIconSize } from './icon-size'

const insetFor = (size: ThemeLayoutSize) => TokenBuilder.numberRef(`theme.padding.${size}`)

const horizontalContentPaddingFor = (size: ThemeLayoutSize) => TokenBuilder.calc(
  'add',
  TokenBuilder.numberRef(`theme.padding.${size}`),
  TokenBuilder.numberRef(`theme.spacing.${size}`)
)

export const pressableButtonBorderWidth = TokenBuilder.numberRef('theme.borderWidth.normal')

export const pressableButtonMinHeight = TokenBuilder.stateful(
  TokenBuilder.numberRef('theme.size.md'),
  TokenBuilder.whenThemeSize((size) => TokenBuilder.numberRef(`theme.size.${size}`))
)

export const pressableButtonBorderRadius = TokenBuilder.borderRadius(
  {
    value: TokenBuilder.numberRef('theme.borderRadius.md'),
  },
  TokenBuilder.whenThemeSize((size) => TokenBuilder.corners({
    value: TokenBuilder.numberRef(`theme.borderRadius.${size}`),
  }))
)

export const pressableButtonGap = TokenBuilder.stateful(
  TokenBuilder.numberRef('theme.spacing.md'),
  TokenBuilder.whenThemeSize((size) => TokenBuilder.numberRef(`theme.spacing.${size}`))
)

export const pressableButtonIconSize = TokenBuilder.stateful(
  TokenBuilder.numberRef('theme.icongraphy.sizes.md'),
  TokenBuilder.whenThemeSize((size) => TokenBuilder.numberRef(`theme.icongraphy.sizes.${toButtonIconSize(size)}`))
)

export const pressableButtonIconStrokeWidth = TokenBuilder.stateful(
  TokenBuilder.numberRef('theme.icongraphy.strokeWidth')
)

export const pressableButtonFontSize = TokenBuilder.stateful(
  TokenBuilder.numberRef('theme.typography.label.md.fontSize'),
  TokenBuilder.whenThemeSize((size) => TokenBuilder.numberRef(`theme.typography.label.${toTypographySize(size)}.fontSize`))
)

export const pressableButtonFontWeight = TokenBuilder.stateful(
  TokenBuilder.numberRef('theme.typography.label.md.fontWeight'),
  TokenBuilder.whenThemeSize((size) => TokenBuilder.numberRef(`theme.typography.label.${toTypographySize(size)}.fontWeight`))
)

export const pressableButtonFontFamily = TokenBuilder.stateful(
  TokenBuilder.fontFamilyRef('theme.typography.label.md.fontFamily'),
  TokenBuilder.whenThemeSize((size) => TokenBuilder.fontFamilyRef(`theme.typography.label.${toTypographySize(size)}.fontFamily`))
)

export const pressableButtonLineHeight = TokenBuilder.stateful(
  TokenBuilder.numberRef('theme.typography.label.md.lineHeight'),
  TokenBuilder.whenThemeSize((size) => TokenBuilder.numberRef(`theme.typography.label.${toTypographySize(size)}.lineHeight`))
)

type AxisPaddingInput = {
  vertical: TokenRef<NumberValueToken> | NumberValueToken,
  horizontal: TokenRef<NumberValueToken> | NumberValueToken,
}

const axisPadding = (
  size: ThemeLayoutSize,
  horizontal: TokenRef<NumberValueToken> | NumberValueToken
): AxisPaddingInput => ({
  vertical: insetFor(size),
  horizontal,
})

export const pressablePadding = TokenBuilder.padding(
  axisPadding('md', insetFor('md')),
  [
    ...TokenBuilder.whenThemeSize((size) => TokenBuilder.sides(axisPadding(size, insetFor(size)))),
    ...TokenBuilder.whenThemeSizeState(
      ['additionalHorizontalPadding'],
      (size) => TokenBuilder.sides(axisPadding(size, horizontalContentPaddingFor(size)))
    ),
  ]
)

const outlinedPaddingFor = (size: ThemeLayoutSize): AxisPaddingInput => ({
  vertical: TokenBuilder.calc(
    'max',
    TokenBuilder.calc('subtract', insetFor(size), pressableButtonBorderWidth),
    TokenBuilder.number(0)
  ),
  horizontal: TokenBuilder.calc(
    'max',
    TokenBuilder.calc('subtract', horizontalContentPaddingFor(size), pressableButtonBorderWidth),
    TokenBuilder.number(0)
  ),
})

export const buttonPadding = TokenBuilder.padding(
  axisPadding('md', horizontalContentPaddingFor('md')),
  [
    ...TokenBuilder.whenThemeSize((size) => TokenBuilder.sides(axisPadding(size, horizontalContentPaddingFor(size)))),
    ...TokenBuilder.whenThemeSizeState(['outlined'], (size) => TokenBuilder.sides(outlinedPaddingFor(size))),
  ]
)
