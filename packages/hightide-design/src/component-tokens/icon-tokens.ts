import type { ColorValueToken } from '../primitive-tokens/color-value-token'
import type { NumberValueToken } from '../primitive-tokens/number-value-token'

export type IconTokens = {
  type: 'icon',
  size?: NumberValueToken,
  strokeWidth?: NumberValueToken,
  color?: ColorValueToken,
}