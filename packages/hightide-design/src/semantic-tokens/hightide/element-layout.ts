import { TokenBuilder } from '../../utils'
import type {
  ThemeLayoutSize,
  ThemeTypographySize
} from '../../theme-tokens/create'
import type { NumberToken } from '../../primitive-tokens/number-token'
import type { NumberValueToken } from '../../primitive-tokens/number-value-token'
import type { TokenRef } from '../../utils/token-type'

export const componentSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
export type ComponentSize = typeof componentSizes[number]

export const typographySizeMapping = {
  xs: 'sm',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'lg',
} as const satisfies Record<ComponentSize, ThemeTypographySize>

export const toTypographySize = (size: ComponentSize): ThemeTypographySize => (
  typographySizeMapping[size]
)

export type ControlElementLayoutToken = {
  size: NumberToken,
  inset: NumberToken,
  borderWidth: NumberToken,
  borderRadius: NumberToken,
  horizontalContentPadding: NumberToken,
}

export type ContainerLayoutToken = {
  size: NumberToken,
  insetY: NumberToken,
  insetX: NumberToken,
  borderRadius: NumberToken,
  minimumWidth: NumberToken,
  minimumHeight: NumberToken,
}

export type InsideControlElementLayoutToken = {
  size: NumberToken,
  inset: NumberToken,
  borderWidth: NumberToken,
  borderRadius: NumberToken,
  paddingExtension: NumberToken,
}

export type ElementLayoutTokens = {
  control: Record<ThemeLayoutSize, ControlElementLayoutToken>,
  container: Record<ThemeLayoutSize, ContainerLayoutToken>,
  insideControl: Record<ThemeLayoutSize, InsideControlElementLayoutToken>,
}

const smallerKeyMapping = {
  xs: 'xs',
  sm: 'xs',
  md: 'sm',
  lg: 'md',
  xl: 'lg',
} as const satisfies Record<ThemeLayoutSize, ThemeLayoutSize>

const forThemeSize = (
  valueForSize: (size: ThemeLayoutSize) => TokenRef<NumberValueToken> | NumberValueToken
) => TokenBuilder.stateful(
  valueForSize('md'),
  TokenBuilder.whenThemeSize(valueForSize)
)

const controlSize = (size: ThemeLayoutSize): TokenRef<NumberValueToken> => (
  TokenBuilder.numberRef(`theme.size.${size}`)
)

const controlInset = (size: ThemeLayoutSize): TokenRef<NumberValueToken> => (
  TokenBuilder.numberRef(`theme.padding.${size}`)
)

const controlBorderRadius = (size: ThemeLayoutSize): TokenRef<NumberValueToken> | NumberValueToken => (
  TokenBuilder.numberRef(`theme.borderRadius.${size}`)
)

const controlHorizontalContentPadding = (size: ThemeLayoutSize): TokenRef<NumberValueToken> | NumberValueToken => (
  TokenBuilder.calc(
    'add',
    TokenBuilder.numberRef(`theme.padding.${size}`),
    TokenBuilder.numberRef(`theme.spacing.${size}`)
  )
)

export const controlLayoutTokens = {
  size: forThemeSize(controlSize),
  inset: forThemeSize(controlInset),
  borderWidth: TokenBuilder.stateful(TokenBuilder.numberRef('theme.borderWidth.normal')),
  borderRadius: forThemeSize(controlBorderRadius),
  horizontalContentPadding: forThemeSize(controlHorizontalContentPadding),
}

const containerSize = (size: ThemeLayoutSize): TokenRef<NumberValueToken> | NumberValueToken => (
  TokenBuilder.numberRef(`theme.size.${size}`)
)

const containerInsetY = (size: ThemeLayoutSize): TokenRef<NumberValueToken> | NumberValueToken => (
  TokenBuilder.numberRef(`theme.padding.${size}`)
)

const containerInsetX = (size: ThemeLayoutSize): TokenRef<NumberValueToken> | NumberValueToken => (
  TokenBuilder.calc(
    'add',
    TokenBuilder.numberRef(`theme.padding.${size}`),
    TokenBuilder.numberRef(`theme.spacing.${size}`)
  )
)

const containerBorderRadius = (size: ThemeLayoutSize): TokenRef<NumberValueToken> | NumberValueToken => (
  TokenBuilder.numberRef(`theme.borderRadius.${size}`)
)

export const containerLayoutTokens = {
  size: forThemeSize(containerSize),
  insetY: forThemeSize(containerInsetY),
  insetX: forThemeSize(containerInsetX),
  borderRadius: forThemeSize(containerBorderRadius),
  minimumWidth: forThemeSize(containerSize),
  minimumHeight: forThemeSize(containerSize),
}

const insideControlSize = (size: ThemeLayoutSize): TokenRef<NumberValueToken> | NumberValueToken => (
  TokenBuilder.calc(
    'subtract',
    TokenBuilder.calc(
      'subtract',
      TokenBuilder.numberRef(`theme.size.${size}`),
      TokenBuilder.calc(
        'multiply',
        TokenBuilder.numberRef(`theme.padding.${size}`),
        TokenBuilder.numberValue(TokenBuilder.number(2))
      )
    ),
    TokenBuilder.calc(
      'multiply',
      TokenBuilder.numberRef('theme.borderWidth.normal'),
      TokenBuilder.numberValue(TokenBuilder.number(2))
    )
  )
)

const insideControlInset = (size: ThemeLayoutSize): TokenRef<NumberValueToken> | NumberValueToken => (
  TokenBuilder.numberRef(`theme.padding.${smallerKeyMapping[size]}`)
)

const insideControlBorderRadius = (size: ThemeLayoutSize): TokenRef<NumberValueToken> | NumberValueToken => (
  TokenBuilder.numberRef(`theme.borderRadius.${smallerKeyMapping[size]}`)
)

const insideControlPaddingExtension = (size: ThemeLayoutSize): TokenRef<NumberValueToken> | NumberValueToken => (
  TokenBuilder.numberRef(`theme.spacing.${smallerKeyMapping[size]}`)
)

export const insideControlLayoutTokens = {
  size: forThemeSize(insideControlSize),
  inset: forThemeSize(insideControlInset),
  borderWidth: TokenBuilder.stateful(TokenBuilder.numberRef('theme.borderWidth.thin')),
  borderRadius: forThemeSize(insideControlBorderRadius),
  paddingExtension: forThemeSize(insideControlPaddingExtension),
}

export const touchTargetSizeTokens = TokenBuilder.stateful(TokenBuilder.numberRef('theme.size.md'))
