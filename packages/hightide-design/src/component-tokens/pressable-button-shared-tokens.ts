import type { ThemeLayoutSize } from '../theme-tokens/theme-tokens-config'
import { toTypographySize } from '../semantic-tokens/element-layout'
import {
  stateful,
  tokenCalc,
  tokenValue,
  tokenVariable,
  whenThemeSize,
  whenThemeSizeState
} from './builders'
import { toButtonIconSize } from './icon-size'

const insetFor = (size: ThemeLayoutSize) => tokenVariable(`theme.padding.${size}`)

const horizontalContentPaddingFor = (size: ThemeLayoutSize) => tokenCalc(
  'add',
  tokenVariable(`theme.padding.${size}`),
  tokenVariable(`theme.spacing.${size}`)
)

export const pressableButtonBorderWidth = tokenVariable('theme.borderWidth.normal')

export const pressableButtonMinHeight = stateful(
  tokenVariable('theme.size.md'),
  whenThemeSize((size) => tokenVariable(`theme.size.${size}`))
)

export const pressableButtonBorderRadius = stateful(
  {
    type: 'all' as const,
    value: tokenVariable('theme.borderRadius.md'),
  },
  whenThemeSize((size) => ({
    type: 'all' as const,
    value: tokenVariable(`theme.borderRadius.${size}`),
  }))
)

export const pressableButtonGap = stateful(
  tokenVariable('theme.spacing.md'),
  whenThemeSize((size) => tokenVariable(`theme.spacing.${size}`))
)

export const pressableButtonIconSize = stateful(
  tokenVariable('theme.icongraphy.sizes.md'),
  whenThemeSize((size) => tokenVariable(`theme.icongraphy.sizes.${toButtonIconSize(size)}`))
)

export const pressableButtonIconStrokeWidth = stateful(
  tokenVariable('theme.icongraphy.strokeWidth')
)

export const pressableButtonFontSize = stateful(
  tokenVariable('theme.typography.label.md.fontSize'),
  whenThemeSize((size) => tokenVariable(`theme.typography.label.${toTypographySize(size)}.fontSize`))
)

export const pressableButtonFontWeight = stateful(
  tokenVariable('theme.typography.label.md.fontWeight'),
  whenThemeSize((size) => tokenVariable(`theme.typography.label.${toTypographySize(size)}.fontWeight`))
)

export const pressableButtonFontFamily = stateful(
  tokenVariable('theme.typography.label.md.fontFamily'),
  whenThemeSize((size) => tokenVariable(`theme.typography.label.${toTypographySize(size)}.fontFamily`))
)

export const pressableButtonLineHeight = stateful(
  tokenVariable('theme.typography.label.md.lineHeight'),
  whenThemeSize((size) => tokenVariable(`theme.typography.label.${toTypographySize(size)}.lineHeight`))
)

const axisPadding = (
  size: ThemeLayoutSize,
  horizontal: ReturnType<typeof insetFor> | ReturnType<typeof horizontalContentPaddingFor>
) => ({
  type: 'physicalAxis' as const,
  vertical: insetFor(size),
  horizontal,
})

export const pressablePadding = stateful(
  axisPadding('md', insetFor('md')),
  [
    ...whenThemeSize((size) => axisPadding(size, insetFor(size))),
    ...whenThemeSizeState(
      ['additionalHorizontalPadding'],
      (size) => axisPadding(size, horizontalContentPaddingFor(size))
    ),
  ]
)

const outlinedPaddingFor = (size: ThemeLayoutSize) => ({
  type: 'physicalAxis' as const,
  vertical: tokenCalc(
    'max',
    tokenCalc('subtract', insetFor(size), pressableButtonBorderWidth),
    tokenValue(0)
  ),
  horizontal: tokenCalc(
    'max',
    tokenCalc('subtract', horizontalContentPaddingFor(size), pressableButtonBorderWidth),
    tokenValue(0)
  ),
})

export const buttonPadding = stateful(
  axisPadding('md', horizontalContentPaddingFor('md')),
  [
    ...whenThemeSize((size) => axisPadding(size, horizontalContentPaddingFor(size))),
    ...whenThemeSizeState(['outlined'], outlinedPaddingFor),
  ]
)
