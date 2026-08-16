import type { ComponentSize } from '../semantic-token-resolvers'
import type { IconSize } from '../theme-tokens/theme-tokens-config'

export const toButtonIconSize = (size: ComponentSize): Extract<IconSize, 'sm' | 'md'> => (
  size === 'xs' || size === 'sm' ? 'sm' : 'md'
)

export const toIconSize = (size: ComponentSize): IconSize => {
  switch (size) {
  case 'xs':
    return 'xs'
  case 'sm':
    return 'sm'
  case 'md':
    return 'md'
  case 'lg':
    return 'lg'
  case 'xl':
    return 'xl'
  }
}
