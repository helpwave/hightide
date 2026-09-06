import type { ComponentSize } from '../semantic-tokens'
import type { IconSize } from '../theme-tokens/theme-tokens-config'

export const buttonIconSizeMapping = {
  xs: 'sm',
  sm: 'sm',
  md: 'md',
  lg: 'md',
  xl: 'md',
} as const satisfies Record<ComponentSize, Extract<IconSize, 'sm' | 'md'>>

export const toButtonIconSize = (size: ComponentSize): Extract<IconSize, 'sm' | 'md'> => (
  buttonIconSizeMapping[size]
)

export const iconSizeMapping = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
} as const satisfies Record<ComponentSize, IconSize>

export const toIconSize = (size: ComponentSize): IconSize => iconSizeMapping[size]
