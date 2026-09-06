import type {
  ThemeLayoutSize,
  ThemeTypographySize
} from '../theme-tokens/theme-tokens-config'
import {
  tokenCalc,
  tokenPath,
  tokenValue
} from '../component-tokens/builders'

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
  size: number,
  inset: number,
  borderWidth: number,
  borderRadius: number,
  horizontalContentPadding: number,
}

export type ContainerLayoutToken = {
  size: number,
  insetY: number,
  insetX: number,
  borderRadius: number,
  minimumWidth: number,
  minimumHeight: number,
}

export type InsideControlElementLayoutToken = {
  size: number,
  inset: number,
  borderWidth: number,
  borderRadius: number,
  paddingExtension: number,
}

export type ElementLayoutTokens = {
  control: Record<ThemeLayoutSize, ControlElementLayoutToken>,
  container: Record<ThemeLayoutSize, ContainerLayoutToken>,
  insideControl: Record<ThemeTypographySize, InsideControlElementLayoutToken>,
}

const smallerKeyMapping = {
  xs: 'xs',
  sm: 'xs',
  md: 'sm',
  lg: 'md',
  xl: 'lg',
} as const satisfies Record<ThemeLayoutSize, ThemeLayoutSize>

const createControlLayoutTokens = (
  size: ThemeLayoutSize
) => ({
  size: tokenPath(`theme.size.${size}`),
  inset: tokenPath(`theme.padding.${size}`),
  borderWidth: tokenPath('theme.borderWidth.normal'),
  borderRadius: tokenPath(`theme.borderRadius.${size}`),
  horizontalContentPadding: tokenCalc(
    'add',
    tokenPath(`theme.padding.${size}`),
    tokenPath(`theme.spacing.${size}`)
  ),
})

const createContainerLayoutTokens = (
  size: ThemeLayoutSize
) => ({
  size: tokenPath(`theme.size.${size}`),
  insetY: tokenPath(`theme.padding.${size}`),
  insetX: tokenCalc(
    'add',
    tokenPath(`theme.padding.${size}`),
    tokenPath(`theme.spacing.${size}`)
  ),
  borderRadius: tokenPath(`theme.borderRadius.${size}`),
  minimumWidth: tokenPath(`theme.size.${size}`),
  minimumHeight: tokenPath(`theme.size.${size}`),
})

const createInsideControlLayoutTokens = (
  size: ThemeLayoutSize
) => {
  const smallerKey = smallerKeyMapping[size]

  return {
    size: tokenCalc(
      'subtract',
      tokenCalc(
        'subtract',
        tokenPath(`theme.size.${size}`),
        tokenCalc(
          'multiply',
          tokenPath(`theme.padding.${size}`),
          tokenValue(2)
        )
      ),
      tokenCalc(
        'multiply',
        tokenPath('theme.borderWidth.normal'),
        tokenValue(2)
      )
    ),
    inset: tokenPath(`theme.padding.${smallerKey}`),
    borderWidth: tokenPath('theme.borderWidth.thin'),
    borderRadius: tokenPath(`theme.borderRadius.${smallerKey}`),
    paddingExtension: tokenPath(`theme.spacing.${smallerKey}`),
  }
}

export const controlLayoutTokens = {
  xs: createControlLayoutTokens('xs'),
  sm: createControlLayoutTokens('sm'),
  md: createControlLayoutTokens('md'),
  lg: createControlLayoutTokens('lg'),
  xl: createControlLayoutTokens('xl'),
} as const

export const containerLayoutTokens = {
  xs: createContainerLayoutTokens('xs'),
  sm: createContainerLayoutTokens('sm'),
  md: createContainerLayoutTokens('md'),
  lg: createContainerLayoutTokens('lg'),
  xl: createContainerLayoutTokens('xl'),
} as const

export const insideControlLayoutTokens = {
  xs: createInsideControlLayoutTokens('xs'),
  sm: createInsideControlLayoutTokens('sm'),
  md: createInsideControlLayoutTokens('md'),
  lg: createInsideControlLayoutTokens('lg'),
  xl: createInsideControlLayoutTokens('xl'),
} as const

export const touchTargetSizeTokens = tokenPath('theme.size.md')
